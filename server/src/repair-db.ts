import 'dotenv/config';
import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT ?? 3306);
const DB_USER = process.env.DB_USER ?? 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
const DB_NAME = process.env.DB_NAME ?? 'tripstay';

async function repair() {
  console.log('🔧 Repairing database schema...');
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
  });

  try {
    console.log('✅ Checking loyalty table...');
    // Update loyalty table enum
    await connection.query(`
      ALTER TABLE loyalty 
      MODIFY COLUMN membership_level ENUM('Silver', 'Gold', 'Platinum', 'Diamond', 'Diamond+', 'Black Diamond') 
      NOT NULL DEFAULT 'Silver'
    `);

    console.log('✅ Checking bookings table...');
    // Add missing columns to bookings
    const [columns] = await connection.query('SHOW COLUMNS FROM bookings');
    const columnNames = (columns as any[]).map(c => c.Field);

    if (!columnNames.includes('coins_redeemed')) {
      console.log('   ➕ Adding coins_redeemed column...');
      await connection.query('ALTER TABLE bookings ADD COLUMN coins_redeemed INT NOT NULL DEFAULT 0 AFTER booking_status');
    }

    if (!columnNames.includes('discount_applied')) {
      console.log('   ➕ Adding discount_applied column...');
      await connection.query('ALTER TABLE bookings ADD COLUMN discount_applied DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER coins_redeemed');
    }

    console.log('✨ Database schema repair completed!');
  } catch (err: any) {
    console.error('❌ Repair failed:', err.message);
  } finally {
    await connection.end();
  }
}

repair();
