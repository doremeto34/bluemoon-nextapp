'use server';

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

//Create monthly utility reading
export async function createMonthlyUtilityReadingAction(household_id: number, month: number, year: number){
  try {
    await sql`
      INSERT INTO utility_reading (household_id, month, year, electricity_usage, water_usage, internet_fee)
      VALUES (${household_id}, ${month}, ${year}, 0, 0, 0);
    `;
    revalidatePath('/dashboard/utility');
  } catch (error) {
    console.error('Error creating utility reading:', error);
    throw error;
  }
}
//Get monthly utility reading
export async function getMonthlyUtilityReadingAction(month: number, year: number) {
  try {
    const result = await sql`
      SELECT
        r.id,
        r.household_id,
        r.month,
        r.year,
        r.electricity_usage,
        r.water_usage,
        r.internet_fee,
        h.id AS room,
        p.full_name AS owner
      FROM utility_reading r
      JOIN households h ON r.household_id = h.id
      JOIN persons p ON h.owner_id = p.id
      WHERE r.month = ${month} AND r.year = ${year}
      ORDER BY h.id ASC;
    `;
    return result.rows;
  } catch (err) {
    console.error("Fetch monthly fee records error:", err);
    return [];
  }
}
//Update monthly utility reading
export async function updateMonthlyUtilityReadingAction(
  id: number, 
  electricity_usage: number,
  water_usage: number,
  internet_fee: number
) {
  try {
    await sql`
      UPDATE utility_reading
      SET electricity_usage = ${electricity_usage}, water_usage = ${water_usage}, internet_fee = ${internet_fee}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/utility");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update monthly fee record" };
  }
}
//Create monthly utility records
export async function createMonthlyUtilityRecordAction(
  household_id : number,
  month : number,
  year : number,
  type : string,
  amount : number
){
  try {
    await sql`
      INSERT INTO utility_fee_records (
        household_id,
        month,
        year,
        type,
        amount,
        status
      )
      SELECT
        ${household_id},
        ${month},
        ${year},
        ${type},
        ${amount},
        'pending'
      WHERE ${amount} > 0
    `;
    revalidatePath('/dashboard/utility');
  } catch (error) {
    console.error('Error creating monthly utility records:', error);
    throw error;
  }
}