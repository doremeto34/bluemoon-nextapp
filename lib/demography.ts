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
        p.status,
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
        cccd,
        status
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
  status: string;
}) {
  try {
    await sql`
      UPDATE persons
      SET full_name = ${data.full_name},
          ngay_sinh = ${data.ngay_sinh},
          cccd = ${data.cccd},
          household_id = ${data.household_id},
          status = ${data.status}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/demography");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update person" };
  }
}
//Create absence record
export async function createAbsenceRecordAction(
  person_id: number,
  type: string,
  reason: string,
  start_date: string, // YYYY-MM-DD
  end_date: string    // YYYY-MM-DD
) {
  try {
    // Check if person exists
    const person = await sql`
      SELECT id FROM persons WHERE id = ${person_id};
    `;
    if (person.rowCount === 0) {
      return { error: "Person does not exist" };
    }
    // Insert absence record
    await sql`
      INSERT INTO temporary_residence_absence
        (person_id, type, reason, start_date, end_date)
      VALUES (
        ${person_id},
        ${type},
        ${reason},
        ${start_date},
        ${end_date}
      );
    `;
    await sql`
      UPDATE persons
      SET status = "${type}"
      WHERE id = ${person_id};
    `;
    revalidatePath("/dashboard/demography");
    return { success: true };
  } catch (err) {
    console.error("Create absence record error:", err);
    return { error: "Cannot create absence record" };
  }
}
//Get all temporary absence record
export async function getAbsenceRecordsAction() {
  try {
    const result = await sql`
      SELECT
        tra.id,
        tra.type,
        tra.reason,
        tra.start_date,
        tra.end_date,
        tra.person_id,

        p.full_name,
        p.ngay_sinh,
        p.cccd,
        p.household_id,
        p.status
      FROM temporary_residence_absence tra
      JOIN persons p ON p.id = tra.person_id
      ORDER BY tra.start_date DESC;
    `;

    return { success: true, data: result.rows };
  } catch (err) {
    console.error("Get absence records error:", err);
    return { error: "Cannot fetch absence records" };
  }
}
//Delete absence record
export async function deleteAbsenceRecordAction(id : number) {
  try {
    await sql`
      DELETE FROM temporary_residence_absence WHERE id = ${id};
    `;
    revalidatePath("/dashboard/demography/absence");
    return { success: true };
  } catch (e) {
    return { error: "Cannot delete record" };
  }
}
