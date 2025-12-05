import { initDatabase } from '../../lib/db';

export default async function SeedPage() {
  await initDatabase();
  return (
    <div>
      <h1>Database Seeded Successfully</h1>
      <p>The database has been initialized and seeded with necessary tables.</p>
    </div>
  );
}