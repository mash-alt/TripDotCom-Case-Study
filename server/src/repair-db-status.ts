import { query } from './config/db.js';

async function repair() {
  console.log('[REPAIR] Updating booking_status ENUM to include CheckedIn...');
  try {
    await query("ALTER TABLE bookings MODIFY COLUMN booking_status ENUM('PendingPayment', 'Confirmed', 'CheckedIn', 'Cancelled', 'Completed') NOT NULL DEFAULT 'PendingPayment';");
    console.log('[REPAIR] Success! ENUM updated.');
  } catch (err: any) {
    console.error('[REPAIR] Failed:', err.message);
  }
  process.exit(0);
}

repair();
