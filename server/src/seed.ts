/**
 * Database Seed Script
 * --------------------
 * Connects to XAMPP MySQL, creates the database,
 * runs schema.sql, then seeds test data from seed.sql.
 *
 * Usage:  npm run seed
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT ?? 3306);
const DB_USER = process.env.DB_USER ?? 'root';
const DB_PASSWORD = process.env.DB_PASSWORD ?? '';
const DB_NAME = process.env.DB_NAME ?? 'tripdotcom';

async function runSqlFile(connection: mysql.Connection, filePath: string, label: string) {
  console.log(`\n📄 Running ${label}...`);
  const sql = fs.readFileSync(filePath, 'utf-8');

  try {
    // Execute the entire file as a single batch (multipleStatements is enabled)
    await connection.query(sql);
    console.log(`   ✅ ${label} completed.`);
  } catch (err: any) {
    // Skip "already exists" or duplicate-entry errors so the script is re-runnable
    if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY') {
      console.log(`   ⚠️  Skipped (${label}): ${err.message.substring(0, 80)}`);
      return;
    }
    console.error(`   ❌ Error running ${label}:`, err.message);
    throw err;
  }
}

async function main() {
  console.log('🚀 TripStay Database Seed Script');
  console.log('================================');
  console.log(`   Host:     ${DB_HOST}:${DB_PORT}`);
  console.log(`   User:     ${DB_USER}`);
  console.log(`   Database: ${DB_NAME}`);
  console.log('');

  // Step 1 — Connect without a database to create it
  console.log('🔌 Connecting to MySQL (XAMPP)...');
  let connection: mysql.Connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    });
    console.log('   ✅ Connected to MySQL successfully!');
  } catch (err: any) {
    console.error('');
    console.error('❌ Could not connect to MySQL. Make sure XAMPP MySQL is running!');
    console.error(`   Error: ${err.message}`);
    console.error('');
    console.error('   💡 Open XAMPP Control Panel → click "Start" next to MySQL');
    process.exit(1);
  }

  // Step 2 — Re-create database
  console.log(`\n🗄️  Wiping and re-creating database "${DB_NAME}"...`);
  await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
  await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
  await connection.query(`USE \`${DB_NAME}\``);
  console.log('   ✅ Database ready.');

  // Step 3 — Run schema
  const schemaPath = path.resolve(__dirname, '..', 'sql', 'schema.sql');
  await runSqlFile(connection, schemaPath, 'schema.sql');

  // Step 4 — Run seed data
  const seedPath = path.resolve(__dirname, '..', 'sql', 'seed.sql');
  await runSqlFile(connection, seedPath, 'seed.sql');

  // Step 5 — Show summary
  console.log('\n📊 Database Summary:');
  const tables = [
    'admins', 'customers', 'loyalty', 'hotels',
    'hotel_images', 'hotel_amenities', 'rooms', 'room_amenities',
    'bookings', 'payments', 'refunds', 'support_tickets',
  ];
  for (const table of tables) {
    const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${table}\``);
    const count = (rows as any)[0].count;
    console.log(`   ${table.padEnd(20)} → ${count} rows`);
  }

  await connection.end();

  console.log('\n✅ Seed completed successfully!');
  console.log('');
  console.log('🔑 Test Accounts (password for ALL: Password123!)');
  console.log('─'.repeat(55));
  console.log('   HOTEL OWNERS (Admins):');
  console.log('     admin@tripstay.com   (System Admin - from schema)');
  console.log('     maria@tripstay.com   (Maria Santos)');
  console.log('     james@tripstay.com   (James Rodriguez)');
  console.log('     liwei@tripstay.com   (Li Wei Chen)');
  console.log('     sophie@tripstay.com  (Sophie Laurent)');
  console.log('     kenji@tripstay.com   (Kenji Tanaka)');
  console.log('');
  console.log('   CUSTOMERS:');
  console.log('     john@gmail.com       (John Doe)');
  console.log('     jane@gmail.com       (Jane Smith)');
  console.log('     mike@gmail.com       (Mike Johnson)');
  console.log('     emily@gmail.com      (Emily Davis)');
  console.log('     carlos@gmail.com     (Carlos Rivera)');
  console.log('     anna@gmail.com       (Anna Lee)');
  console.log('     david@gmail.com      (David Kim)');
  console.log('     sarah@gmail.com      (Sarah Wilson)');
  console.log('     roberto@gmail.com    (Roberto Cruz)');
  console.log('     meiling@gmail.com    (Mei Ling Tan)');
  console.log('');
  console.log('🌐 View in phpMyAdmin: http://localhost/phpmyadmin');
}

main().catch((err) => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
