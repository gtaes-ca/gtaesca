import pool from '../db.js';
import { isSuperAdmin } from '../constants.js';
import { PAGE_PATH_BY_KEY } from '../pages.js';
import { revokeAllUserSessions } from './sessions.js';

export async function listAdminPages() {
  const result = await pool.query(
    `SELECT key, path, label, group_key AS "groupKey", group_label AS "groupLabel", sort_order AS "sortOrder"
     FROM admin_pages
     ORDER BY sort_order, label`
  );
  return result.rows;
}

export async function getAllowedPageKeysForRole(role) {
  const result = await pool.query(
    `SELECT page_key FROM role_page_access WHERE role = $1`,
    [role]
  );
  return result.rows.map((row) => row.page_key);
}

export async function getAllPageKeys() {
  const result = await pool.query(`SELECT key FROM admin_pages ORDER BY sort_order`);
  return result.rows.map((row) => row.key);
}

export async function getAllowedPagesForUser(user) {
  if (!user) return [];
  if (isSuperAdmin(user)) {
    return getAllPageKeys();
  }
  return getAllowedPageKeysForRole(user.role);
}

export async function getPageAccessMatrix() {
  const [pages, accessResult] = await Promise.all([
    listAdminPages(),
    pool.query(`SELECT role, page_key FROM role_page_access`),
  ]);

  const assignments = {};
  for (const row of accessResult.rows) {
    if (!assignments[row.role]) {
      assignments[row.role] = [];
    }
    assignments[row.role].push(row.page_key);
  }

  return { pages, assignments };
}

export async function updateRolePageAccess(role, pageKeys) {
  const uniqueKeys = [...new Set(pageKeys)];
  const validPages = await pool.query(
    `SELECT key FROM admin_pages WHERE key = ANY($1::text[])`,
    [uniqueKeys]
  );

  if (validPages.rowCount !== uniqueKeys.length) {
    throw new Error('One or more page keys are invalid');
  }

  await pool.query('BEGIN');
  try {
    await pool.query(`DELETE FROM role_page_access WHERE role = $1`, [role]);
    if (uniqueKeys.length > 0) {
      await pool.query(
        `INSERT INTO role_page_access (role, page_key)
         SELECT $1, unnest($2::text[])`,
        [role, uniqueKeys]
      );
    }

    await pool.query(
      `UPDATE user_sessions SET revoked_at = NOW()
       WHERE revoked_at IS NULL
         AND user_id IN (SELECT id FROM users WHERE role = $1)`,
      [role]
    );

    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  }

  return getAllowedPageKeysForRole(role);
}

export function getDefaultPathForPages(pageKeys) {
  const orderedKeys = Object.keys(PAGE_PATH_BY_KEY);
  for (const key of orderedKeys) {
    if (pageKeys.includes(key)) {
      return PAGE_PATH_BY_KEY[key];
    }
  }
  return '/pages/profile';
}
