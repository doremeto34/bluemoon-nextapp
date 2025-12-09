'use server';

import { sql } from "@vercel/postgres";

//count households
export async function countHouseholdsAction(): Promise<number> {
  const result = await sql`SELECT COUNT(*) FROM households`;
  return Number(result.rows[0].count);
}
//count demography
export async function countPeopleAction(): Promise<number> {
  const result = await sql`SELECT COUNT(*) FROM persons`;
  return Number(result.rows[0].count);
}
//calculate month revenue
export async function calculateMonthlyRevenueAction(month: number, year: number): Promise<number> {
  const result = await sql`
    SELECT SUM(amount) AS total_revenue
    FROM monthly_fee_records
    WHERE month = ${month}
      AND year = ${year}  `;
  return Number(result.rows[0].total_revenue) || 0;
}