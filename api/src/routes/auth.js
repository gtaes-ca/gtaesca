import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { findUserByEmail, getPublicUser, formatUser } from '../services/users.js';
import { createSession, logoutCurrentSession } from '../services/sessions.js';
import { authenticate, requireAdminPanelAccess } from '../middleware/auth.js';
import { generateOtp, hashValue } from '../utils/crypto.js';
import { sendPasswordResetEmail } from '../services/email.js';
import { activateCustomerAccount, verifyCustomerActivationToken } from '../services/customers.js';
import { updateUserProfile, updateUserProfileImage } from '../services/userProfile.js';
import { USER_TYPES } from '../constants.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await findUserByEmail(email.toLowerCase());

  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.status === 'blocked') {
    return res.status(403).json({ error: 'Your account has been blocked' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Your account is not active yet' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.user_type === USER_TYPES.CUSTOMER) {
    return res.status(403).json({ error: 'Customer accounts cannot access the admin panel' });
  }

  const session = await createSession(
    user.id,
    req.headers['user-agent'],
    req.ip
  );

  return res.json({
    ...session.user,
    token: session.accessToken,
    sessionId: session.sessionId,
  });
});

router.post('/customer/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await findUserByEmail(email.toLowerCase());

  if (!user || !user.password_hash) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.user_type !== USER_TYPES.CUSTOMER) {
    return res.status(403).json({ error: 'Use the team sign-in page for staff accounts' });
  }

  if (user.status === 'blocked') {
    return res.status(403).json({ error: 'Your account has been blocked' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Your account is not active yet' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const session = await createSession(
    user.id,
    req.headers['user-agent'],
    req.ip
  );

  return res.json({
    ...session.user,
    token: session.accessToken,
    sessionId: session.sessionId,
  });
});

router.post('/logout', authenticate, async (req, res) => {
  await logoutCurrentSession(req.sessionId);
  return res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticate, async (req, res) => {
  const user = await getPublicUser(req.user.id);
  return res.json(user);
});

router.put('/profile', authenticate, requireAdminPanelAccess, async (req, res) => {
  if (req.user.userType === USER_TYPES.TECHNICIAN) {
    return res.status(400).json({ error: 'Technician members should update profile via technician onboarding' });
  }

  const { firstName, lastName, phone, bio, profileImageData, removeProfileImage } = req.body;

  if (firstName !== undefined && !String(firstName).trim()) {
    return res.status(400).json({ error: 'First name is required' });
  }
  if (lastName !== undefined && !String(lastName).trim()) {
    return res.status(400).json({ error: 'Last name is required' });
  }

  try {
    let user = await updateUserProfile(req.user.id, { firstName, lastName, phone, bio });

    if (profileImageData || removeProfileImage === true) {
      user = await updateUserProfileImage(req.user.id, { profileImageData, removeProfileImage });
    }

    if (!user) {
      user = await getPublicUser(req.user.id);
    }

    return res.json({ message: 'Profile updated', user });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Profile update failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = await findUserByEmail(email.toLowerCase());
  if (user && user.user_type !== USER_TYPES.SUPER_ADMIN) {
    const otp = generateOtp();
    const otpHash = hashValue(otp);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, otp_hash, otp_expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, otpHash, otpExpiresAt]
    );

    await sendPasswordResetEmail({ email: user.email, otp });
  }

  return res.json({
    message: 'If an account exists for this email, a reset OTP has been sent.',
  });
});

router.post('/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const user = await findUserByEmail(email.toLowerCase());
  if (!user || user.user_type === USER_TYPES.SUPER_ADMIN) {
    return res.status(400).json({ error: 'Invalid reset request' });
  }

  const tokenResult = await pool.query(
    `SELECT * FROM password_reset_tokens
     WHERE user_id = $1 AND used_at IS NULL AND otp_expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [user.id]
  );

  if (tokenResult.rowCount === 0) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const resetToken = tokenResult.rows[0];
  if (resetToken.otp_hash !== hashValue(otp)) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query('BEGIN');
  try {
    await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [passwordHash, user.id]
    );
    await pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`,
      [resetToken.id]
    );
    await pool.query(
      `UPDATE user_sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
      [user.id]
    );
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  return res.json({ message: 'Password reset successfully. Please sign in.' });
});

router.post('/register-customer', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const normalizedEmail = email.toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    if (
      existing.user_type === USER_TYPES.CUSTOMER &&
      existing.status === 'pending' &&
      !existing.password_hash
    ) {
      return res.status(409).json({
        error: 'An account is pending activation for this email. Use the activation link from your booking confirmation email.',
      });
    }
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users
      (email, password_hash, first_name, last_name, user_type, role, status, phone)
     VALUES ($1, $2, $3, $4, $5, $6, 'active', $7)
     RETURNING id, email, first_name, last_name, user_type, role, status, phone, created_at`,
    [normalizedEmail, passwordHash, firstName, lastName, USER_TYPES.CUSTOMER, 'customer', phone || null]
  );

  return res.status(201).json({
    message: 'Customer account created successfully',
    customer: formatUser(result.rows[0]),
  });
});

router.get('/customer-activation/:token', async (req, res) => {
  const result = await verifyCustomerActivationToken(req.params.token);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  return res.json({
    email: result.email,
    firstName: result.firstName,
    lastName: result.lastName,
  });
});

router.post('/customer-activation', async (req, res) => {
  try {
    const result = await activateCustomerAccount(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
