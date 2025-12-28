export type OneTimeFeeRecord = {
  id: number;
  household_id: number;
  fee_id: number;
  amount_paid: number;
  paid_at: string;
  room_number: number;
  owner: string;
};