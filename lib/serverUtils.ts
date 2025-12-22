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
//Calculate electric fee
export const calculateElectricFee = async (usage: number, electricityTiers : {limit: number, price: number}[]) => {
  let remainingUsage = usage;
  let total = 0;
  let previousLimit = 0;
  for (let i = 0; i < electricityTiers.length; i++) {
    const { limit, price } = electricityTiers[i];
    const isLastTier = i === electricityTiers.length - 1;
    const tierUsage = isLastTier
      ? remainingUsage
      : Math.min(remainingUsage, limit - previousLimit);
    if (tierUsage <= 0) break;
    total += tierUsage * price;
    remainingUsage -= tierUsage;
    previousLimit = limit;
  }
  return total;
};