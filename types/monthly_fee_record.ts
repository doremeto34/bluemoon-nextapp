export type MonthlyFeeRecord = {
  id: number;
  household_id: number;
  owner: string;
  month: number;
  year: number;
  amount: number;
  paid: boolean;
};