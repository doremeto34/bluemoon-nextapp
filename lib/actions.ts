'use server';

import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { User } from "@/types/user";
import type { Person } from "@/types/person";
import { MonthlyFeeType } from "@/types/monthly_fee_type";
import { OneTimeFeeType } from "@/types/onetime_fee_type";
import { OneTimeFeeRecord } from "@/types/onetime_fee_record";
import { MonthlyFeeRecord } from "@/types/monthly_fee_record";

function toLocalDateString(date: string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
/* REGISTER */
export async function registerAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${password})
    `;
    return { success: true };
  } catch (err) {
    return { error: "Username đã tồn tại" };
  }
}

/* LOGIN */
export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const { rows } = await sql`
    SELECT * FROM users 
    WHERE username = ${username} 
      AND password = ${password}
  `;

  if (rows.length === 0) {
    return { error: "Sai username/password" };
  }

  // Lấy cookieStore đúng cách
  const cookieStore = await cookies();
  cookieStore.set("session", username, {
    httpOnly: true,
    path: "/",
  });

  return { success: true };
}

/* LOGOUT */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  redirect("/login"); // chuyển về trang login
}

//test database
export async function getUsersAction() {
  try {
    const result = await sql`SELECT * FROM users ORDER BY id ASC;`;
    return result.rows;
  } catch (err) {
    console.error("Fetch users error:", err);
    return [];
  }
}

export async function updateUserAction(id: number, data: { username: string }) {
  try {
    await sql`
      UPDATE users
      SET username = ${data.username}
      WHERE id = ${id};
    `;
    return { success: true };
  } catch (e) {
    return { error: "Cannot update user" };
  }
}

export async function deleteUserAction(id: number) {
  try {
    await sql`
      DELETE FROM users WHERE id = ${id};
    `;
    return { success: true };
  } catch (e) {
    return { error: "Cannot delete user" };
  }
}

//Get households
export async function getHouseholdsAction() {
  try {
    const result = await sql`
      SELECT 
        h.id,
        h.id AS room,
        h.floor,
        h.area,
        h.movein_date,
        p.full_name AS owner,
        (
          SELECT COUNT(*) 
          FROM persons pe 
          WHERE pe.household_id = h.id
        ) AS members,
        CASE 
          WHEN (
            SELECT COUNT(*) 
            FROM persons pe 
            WHERE pe.household_id = h.id
          ) > 0 THEN 'Occupied'
          ELSE 'Empty'
        END AS status
      FROM households h
      LEFT JOIN persons p ON p.id = h.owner_id
      ORDER BY h.id;
    `;

    return result.rows.map(row => ({
      id: row.id,
      room: row.room.toString(),
      area: Number(row.area),
      owner: row.owner || null,
      members: Number(row.members),
      status: row.status,
      floor: row.floor ?? null,
      movein_date: row.movein_date ?? null, // PostgreSQL DATE → string
    }));

  } catch (err) {
    console.error("Error fetching households:", err);
    return [];
  }
}
//Create household
export async function createHouseholdAction(
  id: number,
  owner_id: number | null,
  movein_date: string, // YYYY-MM-DD
) {
  try {
    await sql`
      INSERT INTO households (id, owner_id, area, floor, movein_date)
      VALUES (
        ${id},
        ${owner_id},
        ${movein_date}
      );
    `;
    revalidatePath("/dashboard/household");
    return { success: true };
  } catch (err) {
    console.error("Create household error:", err);
    return { error: "Cannot create household" };
  }
}
//Get household by ID
export async function getHouseholdByIdAction(id: number) {
  try {
    const result = await sql`
      SELECT
        id,
        owner_id,
        area,
        floor,
        movein_date
      FROM households
      WHERE id = ${id};
    `;
    if (result.rows.length === 0) {
      return null;
    }
    const household = result.rows[0];
    // Lấy thông tin owner
    const ownerResult = await sql`
      SELECT id, full_name, ngay_sinh, cccd
      FROM persons
      WHERE id = ${household.owner_id};
    `;
    const owner = ownerResult.rows[0] || null;
    // Lấy danh sách members
    const membersResult = await sql`
      SELECT id, full_name, ngay_sinh, cccd
      FROM persons
      WHERE household_id = ${id};
    `;
    const members = membersResult.rows;
    // Trả về format đúng như FE cần
    return {
      room: String(id),
      owner: owner ? owner.full_name : "Unknown Owner",
      area: household.area ? `${household.area} m²` : "N/A",
      floor: household.floor || "Unknown",
      status: members.length > 0 ? "Occupied" : "Empty",
      moveInDate: household.movein_date
        ? toLocalDateString(household.movein_date)
        : null,
      members: members || [],
      raw: {
        room: household.id,
        owner_id: household.owner_id,
        area: household.area,
        floor: household.floor,
        movein_date: household.movein_date
          ? toLocalDateString(household.movein_date)
          : null,
      }
    };

  } catch (err) {
    console.error("Fetch household by ID error:", err);
    return null;
  }
}
//Add monthly record for household
export async function addMonthlyFeeRecordAction(data: {
  household_id: number;
  month: number;
  year: number;
}) {
  try {
    // Check existing
    const existingResult = await sql`
      SELECT id FROM monthly_fee_records
      WHERE household_id = ${data.household_id}
        AND month = ${data.month}
        AND year = ${data.year};
    `;
    if (existingResult.rows.length > 0) {
      return { error: "Monthly fee record already exists for this household and month/year" };
    }
    // Lấy tất cả fee types đang active
    const feeTypesResult = await sql`
      SELECT id, amount, is_per_m2 FROM monthly_fee_types WHERE active = true;
    `;
    const feeTypes = feeTypesResult.rows;
    // Lấy diện tích household
    const householdResult = await sql`
      SELECT area FROM households WHERE id = ${data.household_id};
    `;
    const household = householdResult.rows[0];
    const area = household ? Number(household.area) : 0;
    // Tính và thêm từng record
    let amount = 0;
    for (const feeType of feeTypes) {
      amount += feeType.is_per_m2 ? feeType.amount * area : feeType.amount;
    }
    await sql`
      INSERT INTO monthly_fee_records (household_id, month, year, amount, paid)
      VALUES (${data.household_id}, ${data.month}, ${data.year}, ${amount}, false);
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (err) {
    console.error("Add monthly fee record error:", err);
    return { error: "Cannot add monthly fee record" };
  }
}
