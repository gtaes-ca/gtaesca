import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './db.js';
import { ROLES, USER_TYPES } from './constants.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const initDir = process.env.DB_INIT_DIR || path.resolve(__dirname, '../../db/init');

async function runSqlFile(relativePath) {
  const filePath = path.join(initDir, relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`Migration file not found: ${filePath}`);
    return;
  }
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
}

export async function migrate() {
  await runSqlFile('01_schema.sql');
  await runSqlFile('02_seed_services.sql');
  await runSqlFile('03_add_profile_image.sql');
  await runSqlFile('04_add_user_bio.sql');
  await runSqlFile('05_service_locations.sql');
  await runSqlFile('06_seed_service_locations.sql');
  await runSqlFile('07_bookings.sql');
  await runSqlFile('08_booking_settings.sql');
  await runSqlFile('09_customer_activation.sql');
  await runSqlFile('10_service_prices.sql');
  await runSqlFile('11_booking_services.sql');
  await runSqlFile('12_rename_labour_to_technician.sql');
  await runSqlFile('13_materials.sql');
  await runSqlFile('14_notifications.sql');
  await runSqlFile('15_page_access.sql');

  const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@gtaes.local';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

  if (existing.rowCount === 0) {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type, role, status, email_verified_at)
       VALUES ($1, $2, 'Super', 'Admin', $3, $4, 'active', NOW())`,
      [email, passwordHash, USER_TYPES.SUPER_ADMIN, ROLES.SUPER_ADMIN]
    );
    console.log(`Super admin created: ${email}`);
  }
}
