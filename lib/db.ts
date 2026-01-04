import { sql } from '@vercel/postgres';

//////////////////////////////////////////////////////
// 1. USERS
//////////////////////////////////////////////////////
export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL CONSTRAINT "users_username_key" UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (users):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// 2. ROOMS & 3. HOUSEHOLDS & 4. PERSONS
//////////////////////////////////////////////////////
export async function createRoomsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS room (
        id SERIAL PRIMARY KEY,
        number INTEGER,
        area INTEGER,
        floor INTEGER
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (room):', error);
    return { success: false, error };
  }
}

export async function createHouseholdsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS households (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER,
        movein_date DATE,
        moveout_date DATE,
        room INTEGER REFERENCES room(id)
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (households):', error);
    return { success: false, error };
  }
}

export async function createPersonsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS persons (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id) ON DELETE SET NULL,
        full_name TEXT,
        ngay_sinh DATE,
        cccd TEXT,
        status TEXT
      );
    `;
    // Apply circular constraint for household owner
    await sql`
      ALTER TABLE households 
      ADD CONSTRAINT fk_owner 
      FOREIGN KEY (owner_id) REFERENCES persons(id) 
      ON DELETE SET NULL;
    `;
    return { success: true };
  } catch (error) {
    if (!String(error).includes('already exists')) {
      console.error('DB error (persons):', error);
      return { success: false, error };
    }
    return { success: true };
  }
}

//////////////////////////////////////////////////////
// 5. TEMPORARY RESIDENCE
//////////////////////////////////////////////////////
export async function createTemporaryResidenceAbsenceTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS temporary_residence_absence (
        id SERIAL PRIMARY KEY,
        type TEXT,
        start_date DATE,
        end_date DATE,
        reason TEXT,
        person_id INTEGER REFERENCES persons(id)
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (temporary_residence_absence):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// 6-7. MONTHLY FEES
//////////////////////////////////////////////////////
export async function createMonthlyFeeTypesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_fee_types (
        id SERIAL PRIMARY KEY,
        name TEXT,
        amount INTEGER,
        is_per_m2 BOOLEAN,
        description TEXT,
        active BOOLEAN
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (monthly_fee_types):', error);
    return { success: false, error };
  }
}

export async function createMonthlyFeeRecordsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_fee_records (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id),
        monthly_fee_id INTEGER REFERENCES monthly_fee_types(id),
        month INTEGER,
        year INTEGER,
        amount INTEGER,
        status TEXT,
        CONSTRAINT "constraint_unique" UNIQUE("household_id", "monthly_fee_id", "month", "year")
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (monthly_fee_records):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// 8-9. ONE-TIME FEES
//////////////////////////////////////////////////////
export async function createOneTimeFeeTypesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS one_time_fee_types (
        id SERIAL PRIMARY KEY,
        name TEXT,
        amount INTEGER,
        description TEXT,
        category TEXT
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (one_time_fee_types):', error);
    return { success: false, error };
  }
}

export async function createOneTimeFeeRecordsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS one_time_fee_records (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id) ON DELETE CASCADE,
        fee_id INTEGER REFERENCES one_time_fee_types(id) ON DELETE CASCADE,
        amount_paid INTEGER,
        paid_at TIMESTAMP
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (one_time_fee_records):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// 10-11. UTILITIES
//////////////////////////////////////////////////////
export async function createUtilityReadingTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS utility_reading (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id),
        month INTEGER,
        year INTEGER,
        electricity_usage NUMERIC,
        water_usage NUMERIC,
        internet_fee INTEGER,
        CONSTRAINT "index_1" UNIQUE("household_id", "month", "year")
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (utility_reading):', error);
    return { success: false, error };
  }
}

export async function createUtilityFeeRecordsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS utility_fee_records (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id),
        month INTEGER,
        year INTEGER,
        type TEXT,
        amount INTEGER,
        status TEXT,
        CONSTRAINT "constraint_2" UNIQUE("household_id", "month", "year", "type")
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (utility_fee_records):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// 12-13. VEHICLES
//////////////////////////////////////////////////////
export async function createVehiclesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id) ON DELETE CASCADE,
        type TEXT,
        plate_number TEXT,
        name TEXT,
        active BOOLEAN
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (vehicles):', error);
    return { success: false, error };
  }
}

export async function createVehicleFeeRecordsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vehicle_fee_records (
        id SERIAL PRIMARY KEY,
        month INTEGER,
        year INTEGER,
        vehicle_id INTEGER REFERENCES vehicles(id),
        amount INTEGER,
        status TEXT,
        CONSTRAINT "constraint_3" UNIQUE("month", "year", "vehicle_id")
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (vehicle_fee_records):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// 14-15. PAYMENT SUMMARIES
//////////////////////////////////////////////////////
export async function createMonthlyPaymentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_payments (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id) ON DELETE CASCADE,
        month INTEGER,
        year INTEGER,
        total_amount INTEGER,
        paid BOOLEAN DEFAULT false
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (monthly_payments):', error);
    return { success: false, error };
  }
}

export async function createVehicleMonthlyPaymentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vehicle_monthly_payments (
        id SERIAL PRIMARY KEY,
        household_id INTEGER REFERENCES households(id) ON DELETE CASCADE,
        month INTEGER,
        year INTEGER,
        total_parking_fee INTEGER,
        paid BOOLEAN DEFAULT false
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (vehicle_monthly_payments):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// INIT ALL 15 TABLES
//////////////////////////////////////////////////////
export async function initDatabase() {
  await createUsersTable(); // 1
  await createRoomsTable(); // 2
  await createHouseholdsTable(); // 3
  await createPersonsTable(); // 4
  await createTemporaryResidenceAbsenceTable(); // 5
  
  await createMonthlyFeeTypesTable(); // 6
  await createMonthlyFeeRecordsTable(); // 7
  await createOneTimeFeeTypesTable(); // 8
  await createOneTimeFeeRecordsTable(); // 9
  
  await createUtilityReadingTable(); // 10
  await createUtilityFeeRecordsTable(); // 11
  
  await createVehiclesTable(); // 12
  await createVehicleFeeRecordsTable(); // 13
  
  await createMonthlyPaymentsTable(); // 14
  await createVehicleMonthlyPaymentsTable(); // 15

  console.log('Database successfully initialized with all 15 tables and unique constraints.');
}
