'use server';

import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { OneTimeFeeType } from "@/types/onetime_fee_type";
import { OneTimeFeeRecord } from "@/types/onetime_fee_record";
import { MonthlyFeeType } from "@/types/monthly_fee_type";
import { MonthlyFeeRecord } from "@/types/monthly_fee_record";

//Create a monthly fee record
type MonthlyFeeRecordInput = {
  household_id: number;
  fee_id: number;
  amount: number;
  month: number;
  year: number;
};

export async function addMonthlyFeeRecordsAction(
  records: MonthlyFeeRecordInput[]
) {
  if (records.length === 0) return [];

  try {
    await sql`
      INSERT INTO monthly_fee_records (
        household_id,
        monthly_fee_id,
        month,
        year,
        amount,
        status
      )
      SELECT
        household_id,
        fee_id,
        month,
        year,
        amount,
        'pending'
      FROM jsonb_to_recordset(${JSON.stringify(records)}::jsonb)
      AS r(
        household_id INTEGER,
        fee_id INTEGER,
        month INTEGER,
        year INTEGER,
        amount INTEGER
      );
    `;
    return { success: true };
  } catch (err) {
    console.error("Bulk insert monthly fee records error:", err);
    return { success: false };
  }
}
//Get monthly fee records
export async function getMonthlyFeeRecordsAction(
  month: number,
  year: number
) {
  try {
    const result = await sql`
      SELECT
        r.id,
        r.household_id,
        r.monthly_fee_id,
        r.month,
        r.year,
        r.amount,
        r.status,

        rm.id AS room_id,
        rm.number AS room_number,
        rm.area,
        rm.floor,

        mft.name AS fee_name,
        mft.amount AS fee_base_amount,
        mft.is_per_m2,
        mft.description
      FROM monthly_fee_records r
      JOIN households h
        ON r.household_id = h.id
      JOIN room rm
        ON h.room = rm.id
      JOIN monthly_fee_types mft
        ON r.monthly_fee_id = mft.id
      WHERE r.month = ${month}
        AND r.year = ${year}
      ORDER BY rm.number ASC;
    `;
    return result.rows;
  } catch (err) {
    console.error("Fetch monthly fee records error:", err);
    return [];
  }
}
//Update status for record
export async function updateMonthlyFeeRecordStatusAction(
  id: number,
  status: string
) {
  try {
    await sql`
      UPDATE monthly_fee_records
      SET status = ${status}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/monthly-fee");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Cannot update monthly fee record status" };
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
        p.full_name as owner,
        rm.number AS room_number   -- Get the room number from the room table
      FROM one_time_fee_records r
      JOIN households h ON r.household_id = h.id
      JOIN persons p ON h.owner_id = p.id
      JOIN room rm ON h.room = rm.id  -- Join with the room table to get the room number
      WHERE r.fee_id = ${fee_id}
      ORDER BY r.paid_at DESC;
    `;
    return result.rows as OneTimeFeeRecord[];
  } catch (err) {
    console.error("Fetch one-time fee records by fee ID error:", err);
    return [];
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
