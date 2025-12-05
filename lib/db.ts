import { sql } from '@vercel/postgres';

//////////////////////////////////////////////////////
// USERS
//////////////////////////////////////////////////////

export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('Database setup error (users):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// HOUSEHOLDS & PERSONS
//////////////////////////////////////////////////////

export async function createHouseholdsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS households (
        id SERIAL PRIMARY KEY,
        owner_id INT UNIQUE,       -- set FK later because persons not created yet
        area INT
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
        household_id INT REFERENCES households(id) ON DELETE SET NULL,
        full_name TEXT,
        ngay_sinh DATE,
        cccd TEXT
      );
    `;

    // Add FK owner_id → persons now (circular safe)
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

export async function createTemporaryResidenceAbsenceTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS temporary_residence_absence (
        id SERIAL PRIMARY KEY,
        cccd TEXT,
        name VARCHAR(255),
        type TEXT,
        start_date DATE,
        end_date DATE,
        reason TEXT
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (temporary_residence_absence):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// MONTHLY FEES
//////////////////////////////////////////////////////

export async function createMonthlyFeeTypesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_fee_types (
        id SERIAL PRIMARY KEY,
        name TEXT,
        amount INT,
        is_per_m2 BOOLEAN,
        description TEXT
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
        household_id INT REFERENCES households(id) ON DELETE CASCADE,
        fee_type_id INT REFERENCES monthly_fee_types(id) ON DELETE CASCADE,
        month INT,
        year INT,
        amount INT
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (monthly_fee_records):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// ONE-TIME FEES
//////////////////////////////////////////////////////

export async function createOneTimeFeeTypesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS one_time_fee_types (
        id SERIAL PRIMARY KEY,
        name TEXT,
        amount INT,
        description TEXT
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
        household_id INT REFERENCES households(id) ON DELETE CASCADE,
        fee_id INT REFERENCES one_time_fee_types(id) ON DELETE CASCADE,
        amount_paid INT,
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
// VEHICLES & PARKING
//////////////////////////////////////////////////////

export async function createVehiclesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        household_id INT REFERENCES households(id) ON DELETE CASCADE,
        type TEXT,
        plate_number TEXT
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
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        month INT,
        year INT,
        amount INT
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (vehicle_fee_records):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// MONTHLY SUM TABLES
//////////////////////////////////////////////////////

export async function createMonthlyPaymentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS monthly_payments (
        id SERIAL PRIMARY KEY,
        household_id INT REFERENCES households(id) ON DELETE CASCADE,
        month INT,
        year INT,
        total_amount INT,
        paid BOOLEAN DEFAULT FALSE
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
        household_id INT REFERENCES households(id) ON DELETE CASCADE,
        month INT,
        year INT,
        total_parking_fee INT,
        paid BOOLEAN DEFAULT FALSE
      );
    `;
    return { success: true };
  } catch (error) {
    console.error('DB error (vehicle_monthly_payments):', error);
    return { success: false, error };
  }
}

//////////////////////////////////////////////////////
// INIT ALL TABLES IN ORDER
//////////////////////////////////////////////////////

export async function initDatabase() {
  await createUsersTable();

  await createHouseholdsTable();
  await createPersonsTable();
  await createTemporaryResidenceAbsenceTable();

  await createMonthlyFeeTypesTable();
  await createMonthlyFeeRecordsTable();

  await createOneTimeFeeTypesTable();
  await createOneTimeFeeRecordsTable();

  await createVehiclesTable();
  await createVehicleFeeRecordsTable();

  await createMonthlyPaymentsTable();
  await createVehicleMonthlyPaymentsTable();

  console.log('All tables created successfully');
}
