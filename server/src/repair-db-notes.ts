import { query } from './config/db.js';

async function repair() {
  console.log('[REPAIR] Adding internal_notes column to bookings table...');
  try {
    await query('ALTER TABLE bookings ADD COLUMN internal_notes TEXT NULL AFTER cancelled_at;');
    console.log('[REPAIR] Success! internal_notes column added.');
  } catch (err: any) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('[REPAIR] Column already exists, skipping.');
    } else {
      console.error('[REPAIR] Failed:', err.message);
    }
  }
  process.exit(0);
}

repair();
