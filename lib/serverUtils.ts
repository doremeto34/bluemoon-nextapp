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
//Get last 12 months utility receive
export async function getLast12MonthsUtilityRevenueAction(type: string){
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const result = await sql`
    SELECT
      year,
      month,
      SUM(amount) AS total
    FROM utility_fee_records
    WHERE (year, month) >= (${start.getFullYear()}, ${start.getMonth() + 1})
      AND type = ${type}
      AND status = 'paid'
    GROUP BY year, month
    ORDER BY year, month;
  `;

  return result.rows;
}
//Get data for pie chart
export async function getDashboardPieChartAction() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const result = await sql`
    SELECT name, SUM(value) AS value
    FROM (
      SELECT
        'Monthly' AS name,
        amount AS value
      FROM monthly_fee_records
      WHERE year = ${year}
        AND month = ${month}
        AND status = 'paid'

      UNION ALL

      SELECT
        'Vehicle' AS name,
        amount AS value
      FROM vehicle_fee_records
      WHERE year = ${year}
        AND month = ${month}
        AND status = 'paid'

      UNION ALL

      SELECT
        type AS name,
        amount AS value
      FROM utility_fee_records
      WHERE year = ${year}
        AND month = ${month}
        AND status = 'paid'
        AND type IN ('Electric', 'Water', 'Internet')
    ) combined
    GROUP BY name;
  `;

  return result.rows;
}