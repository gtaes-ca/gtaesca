import pool from '../db.js';
import { getAllowedPagesForUser } from './pageAccess.js';
import { getBookingSettings } from './bookingSettings.js';

function formatUser(row, allowedPages = undefined) {
  if (!row) return null;
  const user = {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    userType: row.user_type,
    role: row.role,
    status: row.status,
    emailVerified: Boolean(row.email_verified_at),
    phone: row.phone,
    profileImageUrl: row.profile_image_url,
    bio: row.bio,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (allowedPages !== undefined) {
    user.allowedPages = allowedPages;
  }

  return user;
}

export async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getPublicUser(id) {
  const user = await findUserById(id);
  if (!user) return null;
  const formatted = formatUser(user);
  const [allowedPages, bookingSettings] = await Promise.all([
    getAllowedPagesForUser(formatted),
    getBookingSettings(),
  ]);
  return {
    ...formatUser(user, allowedPages),
    bookingMode: bookingSettings.bookingMode,
  };
}

export { formatUser };
