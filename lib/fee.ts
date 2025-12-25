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

// Get all monthly fee type
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
    return result.rows;
  } catch (err) {
    console.error("Fetch monthly fee types error:", err);
    return [];
  }
}
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
export async function getMonthlyFeeRecordsAction(month: number, year: number) {
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

        h.id AS room,
        h.area,
        h.floor,

        mft.name AS fee_name,
        mft.amount AS fee_base_amount,
        mft.is_per_m2,
        mft.description
      FROM monthly_fee_records r
      JOIN households h 
        ON r.household_id = h.id
      JOIN monthly_fee_types mft
        ON r.monthly_fee_id = mft.id
      WHERE r.month = ${month}
        AND r.year = ${year}
      ORDER BY h.id ASC, mft.name ASC;
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


