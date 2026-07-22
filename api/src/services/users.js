import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { getAllowedPagesForUser } from './pageAccess.js';
import { getBookingSettings } from './bookingSettings.js';
import {
  INVITABLE_USER_TYPES,
  isValidRoleForUserType,
  USER_TYPES,
} from '../constants.js';

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

/**
 * Create an active team member (operation_team or technician) with a password.
 * Used by invite accept and by admin manual create.
 */
export async function createTeamUser({
  email,
  password,
  firstName,
  lastName,
  userType,
  role,
  phone = null,
  client = pool,
}) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail || !password || !firstName || !lastName || !userType || !role) {
    const error = new Error('Email, password, name, user type, and role are required');
    error.status = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error('Password must be at least 8 characters');
    error.status = 400;
    throw error;
  }

  if (!INVITABLE_USER_TYPES.includes(userType)) {
    const error = new Error('Invalid user type');
    error.status = 400;
    throw error;
  }

  if (!isValidRoleForUserType(userType, role)) {
    const error = new Error('Invalid role for the selected user type');
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userResult = await client.query(
    `INSERT INTO users
      (email, password_hash, first_name, last_name, user_type, role, status, email_verified_at, phone)
     VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW(), $7)
     RETURNING *`,
    [
      normalizedEmail,
      passwordHash,
      String(firstName).trim(),
      String(lastName).trim(),
      userType,
      role,
      phone ? String(phone).trim() : null,
    ]
  );

  const user = userResult.rows[0];

  if (userType === USER_TYPES.TECHNICIAN) {
    await client.query(`INSERT INTO technician_profiles (user_id) VALUES ($1)`, [user.id]);
  }

  return user;
}

export function isSuperAdminUserRow(user) {
  return user?.user_type === USER_TYPES.SUPER_ADMIN || user?.userType === USER_TYPES.SUPER_ADMIN;
}

export { formatUser };
