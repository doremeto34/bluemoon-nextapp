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
//Get last 12 months monthly receive
export async function getLast12MonthsRevenueAction() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const result = await sql`
    SELECT
      year,
      month,
      SUM(amount) AS total
    FROM monthly_fee_records
    WHERE (year, month) >= (${start.getFullYear()}, ${start.getMonth() + 1})
    GROUP BY year, month
    ORDER BY year, month;
  `;

  return result.rows;
} 
//Get last 12 months vehicle receive
export async function getLast12MonthsVehicleRevenueAction() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const result = await sql`
    SELECT
      year,
      month,
      SUM(amount) AS total
    FROM vehicle_fee_records
    WHERE (year, month) >= (${start.getFullYear()}, ${start.getMonth() + 1})
      AND status = 'paid'
    GROUP BY year, month
    ORDER BY year, month;
  `;

  return result.rows;
}
