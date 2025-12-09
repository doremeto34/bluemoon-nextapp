export type Household = {
  id: number;
  room: string;                 // same as id
  owner: string | null;         // full_name lấy từ persons
  members: number;              // count persons
  status: "Occupied" | "Vacant";
  floor: number | null;         // INT trong DB → nullable
  movein_date: string | null;   // DATE trả về dạng ISO string
}