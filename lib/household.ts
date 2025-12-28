'use server';

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { toLocalDateString } from "@/lib/utils"

//Get households
export async function getRoomsAction() {
  try {
    const result = await sql`
      SELECT
        r.id AS room_id,
        r.number AS room_number,
        r.floor,
        r.area,
        h.id AS household_id,
        h.movein_date,

        p.full_name AS owner,
        (
          SELECT COUNT(*)
          FROM persons pe
          WHERE pe.household_id = h.id
        ) AS members,
        CASE
          WHEN h.id IS NOT NULL THEN 'Occupied'
          ELSE 'Empty'
        END AS status
      FROM room r
      LEFT JOIN households h
        ON h.room = r.id
        AND h.moveout_date IS NULL
      LEFT JOIN persons p
        ON p.id = h.owner_id
      ORDER BY r.number;
    `;


    return result.rows.map(row => ({
      id: row.room_id,
      room: row.room_number.toString(),
      area: Number(row.area),
      owner: row.owner || null,
      members: Number(row.members),
      status: row.status,
      floor: row.floor ?? null,
      movein_date: row.movein_date ?? null, // PostgreSQL DATE → string
    }));

  } catch (err) {
    console.error("Error fetching households:", err);
    return [];
  }
}
// Get household by ID (household_id)
export async function getHouseholdByIdAction(id: number) {
  try {
    // 1. Get household + room info
    const result = await sql`
      SELECT  
        h.id AS household_id,
        h.owner_id,
        h.movein_date,
        h.moveout_date,

        r.id AS room_id,
        r.number AS room_number,
        r.area,
        r.floor
      FROM households h
      JOIN room r ON r.id = h.room
      WHERE h.id = ${id};
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const household = result.rows[0];

    // 2. Get owner info
    const ownerResult = await sql`
      SELECT id, full_name, ngay_sinh, cccd
      FROM persons
      WHERE id = ${household.owner_id};
    `;

    const owner = ownerResult.rows[0] || null;

    // 3. Get members
    const membersResult = await sql`
      SELECT id, full_name, ngay_sinh, cccd
      FROM persons
      WHERE household_id = ${household.household_id};
    `;

    const members = membersResult.rows;

    // 4. Return FE-friendly format
    return {
      household_id: household.household_id,
      room: String(household.room_number),
      owner: owner ? owner.full_name : "Unknown Owner",
      area: household.area ? `${household.area} m²` : "N/A",
      floor: household.floor ?? "Unknown",
      owner_id : household.owner_id,
      status: household.moveout_date === null ? "Occupied" : "Empty",

      moveInDate: household.movein_date
        ? toLocalDateString(household.movein_date)
        : null,
      moveOutDate: household.moveout_date
        ? toLocalDateString(household.moveout_date)
        : null,
      members,

      raw: {
        household_id: household.household_id,
        room_id: household.room_id,
        room_number: household.room_number,
        owner_id: household.owner_id,
        area: household.area,
        floor: household.floor,
        movein_date: household.movein_date
          ? toLocalDateString(household.movein_date)
          : null,
        moveout_date: household.moveout_date
      }
    };

  } catch (err) {
    console.error("Fetch household by ID error:", err);
    return null;
  }
}
//Get households data by roomId
export async function getHouseholdsByRoomId(
  id: number
) {
  try {
    const result = await sql`
      SELECT
        r.id AS room_id,
        r.number AS room_number,
        r.floor,
        r.area,
        h.id AS household_id,
        h.movein_date,
        h.moveout_date,
        p.full_name AS owner
      FROM households h
      JOIN room r ON h.room = r.id
      LEFT JOIN persons p ON p.id = h.owner_id
      WHERE r.id = ${id}
    `;
    return result.rows.map(row => ({
      household_id: row.household_id,
      id: row.room_id,
      room: row.room_number.toString(),
      area: Number(row.area),
      owner: row.owner || null,
      members: Number(row.members),
      status: row.status,
      floor: row.floor ?? null,
      movein_date: row.movein_date ?? null, // PostgreSQL DATE → string
      moveout_date: row.moveout_date ?? null
    }));
  } catch (error) {
    console.error('Error fetching households by room id', error);
    throw error;
  }
}
//Get full households
export async function getFullHouseholdsAction() {
  try {
    const result = await sql`
      SELECT
        r.id AS room_id,
        r.number AS room_number,
        r.floor,
        r.area,
        h.id AS household_id,
        h.movein_date,
        h.moveout_date,
        p.full_name AS owner
        
      FROM room r
      JOIN households h
        ON h.room = r.id
      LEFT JOIN persons p
        ON p.id = h.owner_id
      ORDER BY h.moveout_date;
    `;


    return result.rows.map(row => ({
      household_id: row.household_id,
      id: row.room_id,
      room: row.room_number.toString(),
      area: Number(row.area),
      owner: row.owner || null,
      members: Number(row.members),
      status: row.status,
      floor: row.floor ?? null,
      movein_date: row.movein_date ?? null, // PostgreSQL DATE → string
      moveout_date: row.moveout_date ?? null
    }));

  } catch (err) {
    console.error("Error fetching households:", err);
    return [];
  }
}
//Get current households
export async function getHouseholdsAction() {
  try {
    const result = await sql`
      SELECT
        r.id AS room_id,
        r.number AS room_number,
        r.floor,
        r.area,
        h.id AS household_id,
        h.movein_date,

        p.full_name AS owner
        
      FROM room r
      JOIN households h
        ON h.room = r.id
        AND h.moveout_date IS NULL
      LEFT JOIN persons p
        ON p.id = h.owner_id
      ORDER BY r.number;
    `;


    return result.rows.map(row => ({
      household_id: row.household_id,
      id: row.room_id,
      room: row.room_number.toString(),
      area: Number(row.area),
      owner: row.owner || null,
      members: Number(row.members),
      status: row.status,
      floor: row.floor ?? null,
      movein_date: row.movein_date ?? null, // PostgreSQL DATE → string
    }));

  } catch (err) {
    console.error("Error fetching households:", err);
    return [];
  }
}
//Get room option (full)
export async function getEmptyRoomOptionsAction(){
  try {
    const result = await sql`
      SELECT
        rm.id AS room_id,
        rm.number AS room_number,
        rm.area,
        rm.floor
      FROM room rm
      LEFT JOIN households h ON rm.id = h.room
      WHERE h.room IS NULL  -- Filter for rooms that are not occupied
      ORDER BY rm.number;  -- Optional: Order by room number (or any other criteria)
    `;
    return result.rows.map((row) => ({
      value: row.room_id,        // may be null if empty
      label: String(row.room_number), // what user sees
    }));
  } catch (err) {
    console.error("Error fetching empty rooms:", err);
  }
}
//Get occupied rooms
export async function getRoomOptionsAction() {
  const result = await sql`
    SELECT
      r.number AS room_number,
      h.id AS household_id
    FROM room r
    JOIN households h
      ON h.room = r.id
      AND h.moveout_date IS NULL
    ORDER BY r.number;
  `;
  return result.rows.map((row) => ({
    value: row.household_id,        // may be null if empty
    label: String(row.room_number), // what user sees
  }));
}
//Create room
export async function createRoomAction(
  number : number,
  area : number, 
  floor : number,
) {
  try {
    await sql`
      INSERT INTO room (number, area, floor)
      VALUES (
        ${number}, 
        ${area}, 
        ${floor}
      );
    `;
    return { success: true };
  } catch (err) {
    console.error("Create room error:", err);
    return { error: "Cannot create room" };
  }
}
//Update household info
export async function updateHouseholdAction(
  id: number,
  owner_id: number | null,
  movein_date: string,
  moveout_date: string,
) {
  try {
    if(moveout_date==""){
      await sql`
        UPDATE households
        SET owner_id = ${owner_id},
          movein_date = ${movein_date},
          moveout_date = NULL
        WHERE id = ${id};
      `;
    }else
    await sql`
      UPDATE households
      SET owner_id = ${owner_id},
          movein_date = ${movein_date},
          moveout_date = ${moveout_date}
      WHERE id = ${id};
    `;
    revalidatePath("/dashboard/household");
    return { success: true };
  } catch (e) {
    return { error: "Cannot update household" };
  }
}