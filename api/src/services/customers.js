import pool from '../db.js';
import { USER_TYPES } from '../constants.js';
import { findUserByEmail } from './users.js';
import { generateToken, hashValue } from '../utils/crypto.js';

const WEB_URL = process.env.WEB_URL || process.env.ADMIN_URL || 'http://localhost:3000';
const ACTIVATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function createActivationToken(userId, client = pool) {
  const token = generateToken();
  const tokenHash = hashValue(token);
  const expiresAt = new Date(Date.now() + ACTIVATION_TTL_MS);

  await client.query(
    `UPDATE customer_activation_tokens
     SET used_at = NOW()
     WHERE user_id = $1 AND used_at IS NULL`,
    [userId]
  );

  await client.query(
    `INSERT INTO customer_activation_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );

  return {
    token,
    activationUrl: `${WEB_URL}/account/activate?token=${token}`,
  };
}

export async function resolveCustomerForBooking(
  { email, firstName, lastName, phone },
  client = pool
) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);

  if (existing) {
    if (existing.user_type !== USER_TYPES.CUSTOMER) {
      return {
        customerUserId: null,
        needsActivation: false,
        activationUrl: null,
      };
    }

    await client.query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           phone = COALESCE($3, phone),
           updated_at = NOW()
       WHERE id = $4`,
      [firstName.trim(), lastName.trim(), phone?.trim() || null, existing.id]
    );

    if (existing.password_hash && existing.status === 'active') {
      return {
        customerUserId: existing.id,
        needsActivation: false,
        activationUrl: null,
      };
    }

    const { activationUrl } = await createActivationToken(existing.id, client);
    return {
      customerUserId: existing.id,
      needsActivation: true,
      activationUrl,
    };
  }

  const userResult = await client.query(
    `INSERT INTO users (email, first_name, last_name, user_type, role, status, phone)
     VALUES ($1, $2, $3, $4, $5, 'pending', $6)
     RETURNING id`,
    [
      normalizedEmail,
      firstName.trim(),
      lastName.trim(),
      USER_TYPES.CUSTOMER,
      'customer',
      phone?.trim() || null,
    ]
  );

  const customerUserId = userResult.rows[0].id;
  const { activationUrl } = await createActivationToken(customerUserId, client);

  return {
    customerUserId,
    needsActivation: true,
    activationUrl,
  };
}

export async function getActivationUrlForCustomerUser(customerUserId, client = pool) {
  if (!customerUserId) return null;

  const result = await client.query(
    `SELECT id, password_hash, status, user_type
     FROM users
     WHERE id = $1`,
    [customerUserId]
  );

  if (result.rowCount === 0 || result.rows[0].user_type !== USER_TYPES.CUSTOMER) {
    return null;
  }

  const user = result.rows[0];
  if (user.password_hash && user.status === 'active') {
    return null;
  }

  const { activationUrl } = await createActivationToken(user.id, client);
  return activationUrl;
}

export async function lookupClientByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { found: false };
  }

  const user = await findUserByEmail(normalizedEmail);
  if (user && user.user_type === USER_TYPES.CUSTOMER) {
    return {
      found: true,
      source: 'customer',
      hasAccount: Boolean(user.password_hash && user.status === 'active'),
      isActivated: Boolean(user.password_hash && user.status === 'active'),
      customer: {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email,
        phone: user.phone || '',
      },
    };
  }

  const bookingResult = await pool.query(
    `SELECT client_first_name, client_last_name, client_email, client_phone, client_address
     FROM bookings
     WHERE client_email = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [normalizedEmail]
  );

  if (bookingResult.rowCount > 0) {
    const row = bookingResult.rows[0];
    return {
      found: true,
      source: 'booking',
      hasAccount: false,
      isActivated: false,
      customer: {
        firstName: row.client_first_name || '',
        lastName: row.client_last_name || '',
        email: row.client_email,
        phone: row.client_phone || '',
        address: row.client_address || '',
      },
    };
  }

  return { found: false };
}

export async function verifyCustomerActivationToken(token) {
  const tokenHash = hashValue(token);
  const result = await pool.query(
    `SELECT cat.expires_at, cat.used_at, u.email, u.first_name, u.last_name, u.status, u.password_hash
     FROM customer_activation_tokens cat
     JOIN users u ON u.id = cat.user_id
     WHERE cat.token_hash = $1`,
    [tokenHash]
  );

  if (result.rowCount === 0) {
    return { valid: false, error: 'Activation link not found' };
  }

  const row = result.rows[0];
  if (row.used_at) {
    return { valid: false, error: 'This activation link has already been used' };
  }
  if (new Date(row.expires_at) < new Date()) {
    return { valid: false, error: 'This activation link has expired' };
  }
  if (row.status === 'active' && row.password_hash) {
    return { valid: false, error: 'This account is already active. Please sign in.' };
  }

  return {
    valid: true,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

export async function activateCustomerAccount({ token, password }) {
  if (!token || !password) {
    throw new Error('Activation token and password are required');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const tokenHash = hashValue(token);
  const result = await pool.query(
    `SELECT cat.id AS token_id, cat.expires_at, cat.used_at, u.id AS user_id, u.email, u.status
     FROM customer_activation_tokens cat
     JOIN users u ON u.id = cat.user_id
     WHERE cat.token_hash = $1`,
    [tokenHash]
  );

  if (result.rowCount === 0) {
    throw new Error('Activation link not found');
  }

  const row = result.rows[0];
  if (row.used_at) {
    throw new Error('This activation link has already been used');
  }
  if (new Date(row.expires_at) < new Date()) {
    throw new Error('This activation link has expired');
  }

  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.default.hash(password, 10);

  await pool.query('BEGIN');
  try {
    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           status = 'active',
           email_verified_at = COALESCE(email_verified_at, NOW()),
           updated_at = NOW()
       WHERE id = $2`,
      [passwordHash, row.user_id]
    );
    await pool.query(
      `UPDATE customer_activation_tokens SET used_at = NOW() WHERE id = $1`,
      [row.token_id]
    );
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  return {
    message: 'Account activated successfully. You can sign in once the customer portal is available.',
    email: row.email,
  };
}
