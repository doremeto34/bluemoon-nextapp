'use server';

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import type { Person } from "@/types/person";

//Get persons
export async function getPersonsAction(): Promise<Person[]> {
  try {
    const result = await sql`
      SELECT
        p.id,
        p.household_id,
        p.full_name,
        p.ngay_sinh,
        p.cccd,
        rm.number AS room_number
      FROM persons p
      LEFT JOIN households h
        ON p.household_id = h.id
      LEFT JOIN room rm
        ON h.room = rm.id
      ORDER BY p.id ASC;
    `;
    // ép kiểu để TS không báo lỗi
    return result.rows as Person[];
  } catch (err) {
    console.error("Fetch persons error:", err);
    return [];
  }
}
//Create person
export async function createPersonAction(
  full_name: string,
  ngay_sinh: string, // YYYY-MM-DD
  cccd: string,
  household_id: number | null,
) {
  try {
    await sql`
      INSERT INTO persons (full_name, ngay_sinh, cccd, household_id)
      VALUES (
        ${full_name}, 
        ${ngay_sinh}, 
        ${cccd}, 
        ${household_id}
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
