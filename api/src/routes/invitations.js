import { Router } from 'express';
import pool from '../db.js';
import { authenticate, requirePageAccess } from '../middleware/auth.js';
import {
  INVITABLE_USER_TYPES,
  isValidRoleForUserType,
  USER_TYPES,
} from '../constants.js';
import { generateOtp, generateToken, hashValue } from '../utils/crypto.js';
import { sendInvitationEmail } from '../services/email.js';
import { createTeamUser, formatUser } from '../services/users.js';
import { getBookingSettings, isWhatsAppBookingMode } from '../services/bookingSettings.js';

const router = Router();

async function assertTechnicianInviteAllowed(userType) {
  if (userType !== USER_TYPES.TECHNICIAN) return;
  const settings = await getBookingSettings();
  if (isWhatsAppBookingMode(settings)) {
    const error = new Error('Technician accounts are not available while WhatsApp booking mode is enabled');
    error.status = 400;
    throw error;
  }
}

router.post('/', authenticate, requirePageAccess('management.invitations'), async (req, res) => {
  const { email, userType, role } = req.body;

  if (!email || !userType || !role) {
    return res.status(400).json({ error: 'Email, user type, and role are required' });
  }

  if (!INVITABLE_USER_TYPES.includes(userType)) {
    return res.status(400).json({ error: 'Invalid user type for invitation' });
  }

  if (!isValidRoleForUserType(userType, role)) {
    return res.status(400).json({ error: 'Invalid role for the selected user type' });
  }

  try {
    await assertTechnicianInviteAllowed(userType);
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existingUser.rowCount > 0) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  const pendingInvite = await pool.query(
    `SELECT id FROM team_invitations
     WHERE email = $1 AND accepted_at IS NULL AND expires_at > NOW()`,
    [normalizedEmail]
  );
  if (pendingInvite.rowCount > 0) {
    return res.status(409).json({ error: 'A pending invitation already exists for this email' });
  }

  const token = generateToken();
  const otp = generateOtp();
  const tokenHash = hashValue(token);
  const otpHash = hashValue(otp);
  const now = Date.now();
  const otpExpiresAt = new Date(now + 30 * 60 * 1000);
  const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000);

  const result = await pool.query(
    `INSERT INTO team_invitations
      (email, user_type, role, token_hash, otp_hash, otp_expires_at, invited_by, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, email, user_type, role, created_at, expires_at`,
    [normalizedEmail, userType, role, tokenHash, otpHash, otpExpiresAt, req.user.id, expiresAt]
  );

  await sendInvitationEmail({ email: normalizedEmail, token, otp, userType, role });

  return res.status(201).json({
    invitation: {
      id: result.rows[0].id,
      email: result.rows[0].email,
      userType: result.rows[0].user_type,
      role: result.rows[0].role,
      createdAt: result.rows[0].created_at,
      expiresAt: result.rows[0].expires_at,
    },
    message: 'Invitation sent successfully',
  });
});

router.post('/create-account', authenticate, requirePageAccess('management.invitations'), async (req, res) => {
  const { email, userType, role, firstName, lastName, password, phone } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  try {
    await assertTechnicianInviteAllowed(userType);
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message });
  }

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existingUser.rowCount > 0) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await createTeamUser({
      email: normalizedEmail,
      password,
      firstName,
      lastName,
      userType,
      role: userType === USER_TYPES.TECHNICIAN ? 'technician' : role,
      phone,
      client,
    });

    await client.query(
      `DELETE FROM team_invitations
       WHERE email = $1 AND accepted_at IS NULL`,
      [normalizedEmail]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'User account created successfully. They can sign in with the password you set.',
      user: formatUser(user),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    return res.status(error.status || 500).json({
      error: error.message || 'Failed to create user',
    });
  } finally {
    client.release();
  }
});

router.get('/', authenticate, requirePageAccess('management.invitations'), async (_req, res) => {
  const result = await pool.query(
    `SELECT ti.id, ti.email, ti.user_type, ti.role, ti.created_at, ti.expires_at, ti.accepted_at,
            u.first_name AS invited_by_first_name, u.last_name AS invited_by_last_name
     FROM team_invitations ti
     LEFT JOIN users u ON u.id = ti.invited_by
     ORDER BY ti.created_at DESC`
  );

  return res.json({
    invitations: result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      userType: row.user_type,
      role: row.role,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      acceptedAt: row.accepted_at,
      invitedBy: row.invited_by_first_name
        ? `${row.invited_by_first_name} ${row.invited_by_last_name || ''}`.trim()
        : null,
      status: row.accepted_at ? 'accepted' : row.expires_at < new Date() ? 'expired' : 'pending',
    })),
  });
});

router.post('/:id/resend', authenticate, requirePageAccess('management.invitations'), async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM team_invitations WHERE id = $1`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  const invitation = result.rows[0];

  if (invitation.accepted_at) {
    return res.status(400).json({ error: 'Invitation has already been accepted' });
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invitation has expired. Send a new invitation instead.' });
  }

  const token = generateToken();
  const otp = generateOtp();
  const tokenHash = hashValue(token);
  const otpHash = hashValue(otp);
  const now = Date.now();
  const otpExpiresAt = new Date(now + 30 * 60 * 1000);
  const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000);

  const updated = await pool.query(
    `UPDATE team_invitations
     SET token_hash = $1,
         otp_hash = $2,
         otp_expires_at = $3,
         expires_at = $4,
         invited_by = $5
     WHERE id = $6
     RETURNING id, email, user_type, role, created_at, expires_at`,
    [tokenHash, otpHash, otpExpiresAt, expiresAt, req.user.id, invitation.id]
  );

  await sendInvitationEmail({
    email: invitation.email,
    token,
    otp,
    userType: invitation.user_type,
    role: invitation.role,
  });

  return res.json({
    message: 'Invitation resent successfully',
    invitation: {
      id: updated.rows[0].id,
      email: updated.rows[0].email,
      userType: updated.rows[0].user_type,
      role: updated.rows[0].role,
      createdAt: updated.rows[0].created_at,
      expiresAt: updated.rows[0].expires_at,
      status: 'pending',
    },
  });
});

router.delete('/:id', authenticate, requirePageAccess('management.invitations'), async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM team_invitations WHERE id = $1`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  const invitation = result.rows[0];

  if (invitation.accepted_at) {
    return res.status(400).json({ error: 'Cannot cancel an accepted invitation' });
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invitation has already expired' });
  }

  await pool.query('DELETE FROM team_invitations WHERE id = $1', [invitation.id]);

  return res.json({
    message: 'Invitation cancelled successfully',
    email: invitation.email,
  });
});

router.get('/verify/:token', async (req, res) => {
  const tokenHash = hashValue(req.params.token);
  const result = await pool.query(
    `SELECT email, user_type, role, expires_at, accepted_at
     FROM team_invitations
     WHERE token_hash = $1`,
    [tokenHash]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  const invitation = result.rows[0];
  if (invitation.accepted_at) {
    return res.status(400).json({ error: 'Invitation already accepted' });
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invitation has expired' });
  }

  return res.json({
    email: invitation.email,
    userType: invitation.user_type,
    role: invitation.role,
  });
});

router.post('/accept', async (req, res) => {
  const { token, otp, firstName, lastName, password, phone } = req.body;

  if (!token || !otp || !firstName || !lastName || !password) {
    return res.status(400).json({ error: 'Token, OTP, name, and password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const tokenHash = hashValue(token);
  const result = await pool.query(
    `SELECT * FROM team_invitations WHERE token_hash = $1`,
    [tokenHash]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  const invitation = result.rows[0];

  if (invitation.accepted_at) {
    return res.status(400).json({ error: 'Invitation already accepted' });
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return res.status(400).json({ error: 'Invitation has expired' });
  }
  if (new Date(invitation.otp_expires_at) < new Date()) {
    return res.status(400).json({ error: 'OTP has expired. Ask your admin to resend the invitation.' });
  }
  if (invitation.otp_hash !== hashValue(otp)) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await createTeamUser({
      email: invitation.email,
      password,
      firstName,
      lastName,
      userType: invitation.user_type,
      role: invitation.role,
      phone,
      client,
    });

    await client.query(
      `UPDATE team_invitations SET accepted_at = NOW() WHERE id = $1`,
      [invitation.id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Account created successfully. Please sign in.',
      user: formatUser(user),
      requiresOnboarding: invitation.user_type === USER_TYPES.TECHNICIAN,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    throw error;
  } finally {
    client.release();
  }
});

export default router;
