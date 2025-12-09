// src/lib/actions.ts
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
    return result.rows as User[];
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

//Get persons
export async function getPersonsAction(): Promise<Person[]> {
  try {
    const result = await sql`
      SELECT 
        id,
        household_id,
        full_name,
        ngay_sinh,
        cccd
      FROM persons
      ORDER BY id ASC;
    `;
    // ép kiểu để TS không báo lỗi
    return result.rows as Person[];
  } catch (err) {
    console.error("Fetch persons error:", err);
    return [];
  }
}
//Create person
export async function createPersonAction(data: {
  full_name: string;
  ngay_sinh: string; // YYYY-MM-DD
  cccd: string;
  household_id: number | null;
}) {
  try {
    await sql`
      INSERT INTO persons (full_name, ngay_sinh, cccd, household_id)
      VALUES (
        ${data.full_name}, 
        ${data.ngay_sinh}, 
        ${data.cccd}, 
        ${data.household_id}
      );
    `;
    revalidatePath("/dashboard/demography");
    return { success: true };
  } catch (err) {
    console.error("Create person error:", err);
    return { error: "Cannot create person" };
  }
}
//Delete person
export async function deletePersonAction(id: number) {
  try {
    await sql`
      DELETE FROM persons WHERE id = ${id};
    `;
    revalidatePath("/dashboard/demography");
    return { success: true };
  } catch (e) {
    return { error: "Cannot delete person" };
  }
}
//Get person by ID
export async function getPersonByIdAction(id: number): Promise<Person | null> {
  try {
    const result = await sql`
      SELECT
        id,
        household_id,
        full_name,
        ngay_sinh,
        cccd
      FROM persons
      WHERE id = ${id};
    `;
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0] as Person;
    }
  } catch (err) {
    console.error("Fetch person by ID error:", err);
    return null;
  }
}
//Update person
export async function updatePersonAction(id: number, data: {
  full_name: string;
  ngay_sinh: string; // YYYY-MM-DD
  cccd: string;
  household_id?: number | null;
}) {
  try {
    await sql`
      UPDATE persons
      SET full_name = ${data.full_name},
          ngay_sinh = ${data.ngay_sinh},
          cccd = ${data.cccd},
          household_id = ${data.household_id}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/demography");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update person" };
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
export async function createHouseholdAction(data: {
  id: string;
  owner_id: number;
  area: number;
  floor: number;
  movein_date: string; // YYYY-MM-DD
}) {
  try {
    await sql`
      INSERT INTO households (id, owner_id, area, floor, movein_date)
      VALUES (
        ${data.id},
        ${data.owner_id},
        ${data.area},
        ${data.floor},
        ${data.movein_date}
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
//Update household
export async function updateHouseholdAction(id: number, data: {
  owner_id: number;
  area: number;
  floor: number;
  movein_date: string; // YYYY-MM-DD
}) {
  try {
    await sql`
      UPDATE households
      SET owner_id = ${data.owner_id},
          area = ${data.area},
          floor = ${data.floor},
          movein_date = ${data.movein_date}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/household");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update household" };
  }
}
//Get monthly fee
export async function getMonthlyFeeAction() {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        amount,
        is_per_m2,
        description,
        active
      FROM monthly_fee_types
      ORDER BY id ASC;
    `;
    return result.rows as MonthlyFeeType[];
  } catch (err) {
    console.error("Fetch monthly fee types error:", err);
    return [];
  }
}
//Get monthly fee type by ID
export async function getMonthlyFeeTypeByIdAction(id: number): Promise<MonthlyFeeType | null> {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        amount,
        is_per_m2,
        description,
        active
      FROM monthly_fee_types
      WHERE id = ${id};
    `;
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0] as MonthlyFeeType;
    }
  }
  catch (err) {
    console.error("Fetch monthly fee type by ID error:", err);
    return null;
  }
}
//Add monthly fee type
export async function addMonthlyFeeTypeAction(data: {
  name: string;
  amount: number;
  is_per_m2: boolean;
  description: string;
}) {
  try {
    await sql`
      INSERT INTO monthly_fee_types (name, amount, is_per_m2, description, active)
      VALUES (${data.name}, ${data.amount}, ${data.is_per_m2}, ${data.description}, true);
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (err) {
    console.error("Add monthly fee type error:", err);
    return { error: "Cannot add monthly fee type" };
  }
}
//Update monthly fee type
export async function updateMonthlyFeeTypeAction(id: number, data: {
  name: string;
  amount: number;
  is_per_m2: boolean;
  description: string;
  active: boolean;
}) {
  try {
    await sql`
      UPDATE monthly_fee_types
      SET name = ${data.name},
          amount = ${data.amount},
          is_per_m2 = ${data.is_per_m2},
          description = ${data.description},
          active = ${data.active}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update monthly fee type" };
  }
}
//Get one-time fee
export async function getOneTimeFeeAction() {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        amount,
        description,
        category
      FROM one_time_fee_types
      ORDER BY id ASC;
    `;
    return result.rows as OneTimeFeeType[];
  } catch (err) {
    console.error("Fetch one-time fee types error:", err);
    return [];
  }
}
//Get one-time fee type by ID
export async function getOneTimeFeeTypeByIdAction(id: number): Promise<OneTimeFeeType | null> {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        amount,
        description,
        category
      FROM one_time_fee_types
      WHERE id = ${id};
    `;
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0] as OneTimeFeeType;
    }
  } catch (err) {
    console.error("Fetch one-time fee type by ID error:", err);
    return null;
  }
}
//Add one-time fee type
export async function addOneTimeFeeTypeAction(data: {
  name: string;
  amount: number;
  description: string;
  category: string;
}) {
  try {
    await sql`
      INSERT INTO one_time_fee_types (name, amount, description, category)
      VALUES (${data.name}, ${data.amount}, ${data.description}, ${data.category});
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (err) {
    console.error("Add one-time fee type error:", err);
    return { error: "Cannot add one-time fee type" };
  }
}
//Update one-time fee type
export async function updateOneTimeFeeTypeAction(id: number, data: {
  name: string;
  amount: number;
  description: string;
  category: string;
}) {
  try {
    await sql`
      UPDATE one_time_fee_types
      SET name = ${data.name},
          amount = ${data.amount},
          description = ${data.description},
          category = ${data.category}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update one-time fee type" };
  }
}
//Add one-time fee record
export async function addOneTimeFeeRecordAction(data: {
  household_id: number;
  fee_id: number;
  amount_paid: number;
  paid_at: string; // YYYY-MM-DD
}) {
  try {
    await sql`
      INSERT INTO one_time_fee_records (household_id, fee_id, amount_paid, paid_at)
      VALUES (${data.household_id}, ${data.fee_id}, ${data.amount_paid}, ${data.paid_at});
    `;
    revalidatePath(`/dashboard/fees/onetime/${data.fee_id}`);
    return { success: true };
  } catch (err) {
    console.error("Add one-time fee record error:", err);
    return { error: "Cannot add one-time fee record" };
  }
}
//Remove one-time fee record
export async function removeOneTimeFeeRecordAction(id: number) {
  try {
    await sql`
      DELETE FROM one_time_fee_records WHERE id = ${id};
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (e) {
    return { error: "Cannot delete one-time fee record" };
  }
}
//Get one-time fee records by fee ID
export async function getOneTimeFeeRecordsByFeeIdAction(fee_id: number) {
  try {
    const result = await sql`
      SELECT
        r.id,
        r.household_id,
        r.fee_id,
        r.amount_paid,
        r.paid_at,
        h.id AS room
      FROM one_time_fee_records r
      JOIN households h ON r.household_id = h.id
      WHERE r.fee_id = ${fee_id}
      ORDER BY r.paid_at DESC;
    `;
    return result.rows as OneTimeFeeRecord[];
  } catch (err) {
    console.error("Fetch one-time fee records by fee ID error:", err);
    return [];
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
//Get monthly fee records
export async function getMonthlyFeeRecordsAction(month: number, year: number) {
  try {
    const result = await sql`
      SELECT
        r.id,
        r.household_id,
        r.month,
        r.year,
        r.amount,
        r.paid,
        h.id AS room,
        p.full_name AS owner
      FROM monthly_fee_records r
      JOIN households h ON r.household_id = h.id
      JOIN persons p ON h.owner_id = p.id
      WHERE r.month = ${month} AND r.year = ${year}
      ORDER BY h.id ASC;
    `;
    return result.rows as MonthlyFeeRecord[];
  } catch (err) {
    console.error("Fetch monthly fee records error:", err);
    return [];
  }
}
//Update monthly fee record payment status
export async function updateMonthlyFeeRecordStatusAction(id: number, paid: boolean) {
  try {
    await sql`
      UPDATE monthly_fee_records
      SET paid = ${paid}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update monthly fee record status" };
  }
}