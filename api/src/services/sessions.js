import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { formatUser } from './users.js';
import { getAllowedPagesForUser } from './pageAccess.js';
import { getBookingSettings } from './bookingSettings.js';
import { hashValue } from '../utils/crypto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gtaes-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export function signAccessToken(user, sessionId) {
  return jwt.sign(
    {
      sub: user.id,
      sid: sessionId,
      userType: user.user_type,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function createSession(userId, userAgent, ipAddress) {
  const sessionId = crypto.randomUUID();
  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  const user = userResult.rows[0];
  const accessToken = signAccessToken(user, sessionId);
  const tokenHash = hashValue(accessToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO user_sessions (id, user_id, token_hash, user_agent, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [sessionId, userId, tokenHash, userAgent || null, ipAddress || null, expiresAt]
  );

  const bookingSettings = await getBookingSettings();

  return {
    accessToken,
    sessionId,
    user: {
      ...formatUser(user),
      allowedPages: await getAllowedPagesForUser(formatUser(user)),
      bookingMode: bookingSettings.bookingMode,
    },
  };
}

export async function revokeSession(sessionId) {
  await pool.query(
    `UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL`,
    [sessionId]
  );
}

export async function revokeAllUserSessions(userId) {
  const result = await pool.query(
    `UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
  return result.rowCount;
}

export async function validateSession(sessionId, token) {
  const result = await pool.query(
    `SELECT s.*, u.*
     FROM user_sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = $1
       AND s.revoked_at IS NULL
       AND s.expires_at > NOW()
       AND u.status = 'active'`,
    [sessionId]
  );

  if (result.rowCount === 0) return null;

  const row = result.rows[0];
  const tokenHash = hashValue(token);
  if (row.token_hash !== tokenHash) return null;

  return formatUser(row);
}

export async function logoutCurrentSession(sessionId) {
  await revokeSession(sessionId);
}
