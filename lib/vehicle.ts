'use server';

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

//Add Vehicle
export async function createVehicleAction(data: {
  household_id: string;
  name: string;
  type: string;
  plate_number: string;
}) {
  try {
    await sql`
      INSERT INTO vehicles (household_id, name, type, plate_number, active)
      VALUES (${data.household_id}, ${data.name}, ${data.type}, ${data.plate_number}, true);
    `;
    revalidatePath('/dashboard/vehicle');
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}
//Get All Vehicles
export async function getVehiclesAction() {
  try {
    const result = await sql`
      SELECT * FROM vehicles ORDER BY id;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}
//Get Vehicles by Household ID
export async function getVehiclesByHouseholdIdAction(householdId: number) {
  try {
    const result = await sql`
      SELECT * FROM vehicles WHERE household_id = ${householdId};
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching vehicles by household ID:', error);
    throw error;
  }
}
//Get Vehicle by ID
export async function getVehicleByIdAction(vehicleId: number) {
  try {
    const result = await sql`
      SELECT * FROM vehicles WHERE id = ${vehicleId};
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    throw error;
  }
}
//Update Vehicle
export async function updateVehicleAction(vehicleId: number, data: {
  household_id: string;
  name: string;
  type: string;
  plate_number: string;
  active: boolean;
}) {
  try {
    await sql`
      UPDATE vehicles
      SET household_id = ${data.household_id},
          name = ${data.name},
          type = ${data.type},
          plate_number = ${data.plate_number},
          active = ${data.active}
      WHERE id = ${vehicleId};
    `;
    revalidatePath('/dashboard/vehicle');
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}
//Add monthly vehicle fee record 
export async function addVehicleFeeRecordAction(data: {
  household_id: number;
  month: number;
  year: number;
  motorbikeFee: number;
  carFee: number;
}) {
  const { household_id, month, year, motorbikeFee, carFee } = data;
  try {
    // 0. Kiểm tra đã tồn tại record chưa
    const existing = await sql`
      SELECT id FROM vehicle_monthly_fee_records
      WHERE household_id = ${household_id}
        AND month = ${month}
        AND year = ${year}
    `;
    if (existing.rows.length > 0) {
      // Đã có record → không làm gì nữa
      return { error: "Record already exists for this month/year" };
    }
    // 1. Lấy số xe active theo household
    const vehicleCounts = await sql`
      SELECT 
        SUM(CASE WHEN type = 'Xe máy' AND active = TRUE THEN 1 ELSE 0 END) AS motorbike_count,
        SUM(CASE WHEN type = 'Ô tô' AND active = TRUE THEN 1 ELSE 0 END) AS car_count
      FROM vehicles
      WHERE household_id = ${household_id};
    `;
    const motorbikeCount = Number(vehicleCounts.rows[0].motorbike_count) || 0;
    const carCount = Number(vehicleCounts.rows[0].car_count) || 0;
    if (motorbikeCount === 0 && carCount === 0) {
      return { message: "No active vehicles, skip creating record" };
    }
    // 2. Tính amount
    const amount =
      motorbikeCount * motorbikeFee + carCount * carFee;
    // 3. Insert mới
    await sql`
      INSERT INTO vehicle_monthly_fee_records (household_id, month, year, amount, paid)
      VALUES (${household_id}, ${month}, ${year}, ${amount}, false);
    `;
    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (err) {
    console.error("Error creating vehicle fee record:", err);
    return { error: "Cannot add vehicle monthly fee record" };
  }
}
//Get vehicle monthly records
export async function getVehicleMonthlyFeeRecordsAction(month: number, year: number) {
  try {
    const result = await sql`
      SELECT 
        r.id,
        r.household_id,
        r.month,
        r.year,
        r.amount,
        r.paid,
        h.area,
        h.floor,
        p.full_name AS owner
      FROM vehicle_monthly_fee_records r
      JOIN households h ON r.household_id = h.id
      JOIN persons p ON h.owner_id = p.id
      WHERE r.month = ${month}
        AND r.year = ${year}
      ORDER BY r.household_id ASC;
    `;
    return result.rows;
  } catch (error) {
    console.error("Error fetching vehicle monthly fee records:", error);
    return [];
  }
}

//Update vehicle monthly records status
export async function updateVehicleMonthlyFeeRecordStatusAction(id: number, paid: boolean) {
  try {
    await sql`
      UPDATE vehicle_monthly_fee_records
      SET paid = ${paid}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/vehicle");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update vehicle monthly fee record status" };
  }
}

