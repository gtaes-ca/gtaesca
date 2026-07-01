import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../../db.js';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import { formatUser } from '../../services/users.js';
import { revokeAllUserSessions } from '../../services/sessions.js';
import {
  isValidRoleForUserType,
  OPERATION_ROLES,
  ROLES,
  USER_TYPES,
} from '../../constants.js';

const router = Router();

async function loadExpertiseForUsers(userIds) {
  if (!userIds.length) return new Map();

  const result = await pool.query(
    `SELECT le.user_id, s.id, s.name, sc.name AS category_name
     FROM technician_expertise le
     JOIN services s ON s.id = le.service_id
     JOIN service_categories sc ON sc.id = s.category_id
     WHERE le.user_id = ANY($1::uuid[])
     ORDER BY sc.sort_order, s.sort_order, s.name`,
    [userIds]
  );

  const map = new Map();
  for (const row of result.rows) {
    if (!map.has(row.user_id)) map.set(row.user_id, []);
    map.get(row.user_id).push({
      id: row.id,
      name: row.name,
      categoryName: row.category_name,
    });
  }
  return map;
}

async function loadExpertiseForUser(userId) {
  const map = await loadExpertiseForUsers([userId]);
  return map.get(userId) || [];
}

async function replaceUserExpertise(userId, serviceIds) {
  if (!Array.isArray(serviceIds)) {
    throw new Error('serviceIds must be an array');
  }

  const uniqueIds = [...new Set(serviceIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];

  await pool.query('BEGIN');
  try {
    await pool.query('DELETE FROM technician_expertise WHERE user_id = $1', [userId]);

    if (uniqueIds.length > 0) {
      const validServices = await pool.query(
        'SELECT id FROM services WHERE id = ANY($1::int[])',
        [uniqueIds]
      );

      if (validServices.rowCount !== uniqueIds.length) {
        throw new Error('One or more selected services are invalid');
      }

      for (const row of validServices.rows) {
        await pool.query(
          'INSERT INTO technician_expertise (user_id, service_id) VALUES ($1, $2)',
          [userId, row.id]
        );
      }
    }

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  return loadExpertiseForUser(userId);
}

router.get('/', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const { userType, status, search } = req.query;
  const conditions = [`user_type != $1`];
  const params = [USER_TYPES.CUSTOMER];
  let paramIndex = 2;

  if (userType) {
    conditions.push(`user_type = $${paramIndex++}`);
    params.push(userType);
  }
  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (search) {
    conditions.push(`(email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const result = await pool.query(
    `SELECT id, email, first_name, last_name, user_type, role, status, email_verified_at, phone, profile_image_url, created_at, updated_at
     FROM users
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC`,
    params
  );

  let users = result.rows.map(formatUser);

  if (userType === USER_TYPES.TECHNICIAN && users.length > 0) {
    const expertiseMap = await loadExpertiseForUsers(users.map((user) => user.id));
    users = users.map((user) => ({
      ...user,
      expertise: expertiseMap.get(user.id) || [],
    }));
  }

  return res.json({ users });
});

router.get('/customers', authenticate, requirePageAccess('management.customers'), async (req, res) => {
  const { status, search } = req.query;
  const conditions = [`user_type = $1`];
  const params = [USER_TYPES.CUSTOMER];
  let paramIndex = 2;

  if (status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (search) {
    conditions.push(`(email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
  }

  const result = await pool.query(
    `SELECT id, email, first_name, last_name, user_type, role, status, email_verified_at, phone, created_at, updated_at
     FROM users
     WHERE ${conditions.join(' AND ')}
     ORDER BY created_at DESC`,
    params
  );

  return res.json({ customers: result.rows.map(formatUser) });
});

router.get('/:id/expertise', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const user = await pool.query('SELECT id, user_type FROM users WHERE id = $1', [req.params.id]);
  if (user.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.rows[0].user_type !== USER_TYPES.TECHNICIAN) {
    return res.status(400).json({ error: 'Expertise is only available for technician team members' });
  }

  const expertise = await loadExpertiseForUser(req.params.id);
  return res.json({ expertise });
});

router.put('/:id/expertise', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const { serviceIds } = req.body;
  const user = await pool.query('SELECT id, user_type FROM users WHERE id = $1', [req.params.id]);
  if (user.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (user.rows[0].user_type !== USER_TYPES.TECHNICIAN) {
    return res.status(400).json({ error: 'Expertise can only be updated for technician team members' });
  }

  try {
    const expertise = await replaceUserExpertise(req.params.id, serviceIds);
    return res.json({ message: 'Service expertise updated', expertise });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/role', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const { role } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);

  if (user.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const target = user.rows[0];

  if (target.user_type === USER_TYPES.SUPER_ADMIN) {
    return res.status(403).json({ error: 'Cannot change super admin role' });
  }

  if (target.user_type === USER_TYPES.CUSTOMER) {
    return res.status(400).json({ error: 'Customer roles cannot be changed from admin panel' });
  }

  if (!isValidRoleForUserType(target.user_type, role)) {
    return res.status(400).json({ error: 'Invalid role for user type' });
  }

  if (target.role === role) {
    return res.json({ user: formatUser(target), sessionsRevoked: 0 });
  }

  const result = await pool.query(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [role, req.params.id]
  );

  const revokedCount = await revokeAllUserSessions(req.params.id);

  return res.json({
    user: formatUser(result.rows[0]),
    message: 'Role updated and all sessions revoked',
    sessionsRevoked: revokedCount,
  });
});

router.patch('/:id/status', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const { status } = req.body;

  if (!['active', 'blocked'].includes(status)) {
    return res.status(400).json({ error: 'Status must be active or blocked' });
  }

  const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  if (user.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.rows[0].user_type === USER_TYPES.SUPER_ADMIN) {
    return res.status(403).json({ error: 'Cannot block super admin account' });
  }

  const result = await pool.query(
    `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, req.params.id]
  );

  if (status === 'blocked') {
    const revokedCount = await revokeAllUserSessions(req.params.id);
    return res.json({
      user: formatUser(result.rows[0]),
      message: 'User blocked and all sessions revoked',
      sessionsRevoked: revokedCount,
    });
  }

  return res.json({ user: formatUser(result.rows[0]) });
});

router.patch('/:id/password', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const user = await pool.query('SELECT id FROM users WHERE id = $1', [req.params.id]);
  if (user.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [passwordHash, req.params.id]
  );
  await revokeAllUserSessions(req.params.id);

  return res.json({ message: 'Password updated and all sessions revoked' });
});

router.post('/:id/revoke-sessions', authenticate, requirePageAccess('management.users'), async (req, res) => {
  const user = await pool.query('SELECT id FROM users WHERE id = $1', [req.params.id]);
  if (user.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  const revokedCount = await revokeAllUserSessions(req.params.id);
  return res.json({
    message: 'All sessions revoked for user',
    sessionsRevoked: revokedCount,
  });
});

router.get('/meta/roles', authenticate, requirePageAccess('management.users'), (_req, res) => {
  return res.json({
    operationRoles: OPERATION_ROLES,
    technicianRoles: [ROLES.TECHNICIAN],
    userTypes: [USER_TYPES.OPERATION_TEAM, USER_TYPES.TECHNICIAN],
  });
});

export default router;
