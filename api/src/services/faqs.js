import pool from '../db.js';

export function formatFaq(row) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listFaqs({ active, search = '', page = 1, limit = 20 } = {}) {
  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (pageNum - 1) * pageSize;

  const conditions = [];
  const params = [];

  if (active === 'true') {
    conditions.push('is_active = TRUE');
  } else if (active === 'false') {
    conditions.push('is_active = FALSE');
  }

  if (search?.trim()) {
    params.push(`%${search.trim()}%`);
    const idx = params.length;
    conditions.push(`(question ILIKE $${idx} OR answer ILIKE $${idx})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM faqs ${where}`, params);
  const total = countResult.rows[0].total;

  const listParams = [...params, pageSize, offset];
  const result = await pool.query(
    `SELECT id, question, answer, sort_order, is_active, created_at, updated_at
     FROM faqs
     ${where}
     ORDER BY sort_order ASC, created_at ASC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );

  return {
    faqs: result.rows.map(formatFaq),
    pagination: {
      page: pageNum,
      limit: pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export async function getFaqById(id) {
  const result = await pool.query(
    `SELECT id, question, answer, sort_order, is_active, created_at, updated_at
     FROM faqs WHERE id = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return formatFaq(result.rows[0]);
}

export async function createFaq({ question, answer, sortOrder, isActive }) {
  const result = await pool.query(
    `INSERT INTO faqs (question, answer, sort_order, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING id, question, answer, sort_order, is_active, created_at, updated_at`,
    [
      question.trim(),
      answer.trim(),
      Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
      isActive !== false,
    ]
  );

  return formatFaq(result.rows[0]);
}

export async function updateFaq(id, { question, answer, sortOrder, isActive }) {
  const result = await pool.query(
    `UPDATE faqs
     SET question = COALESCE($1, question),
         answer = COALESCE($2, answer),
         sort_order = COALESCE($3, sort_order),
         is_active = COALESCE($4, is_active),
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, question, answer, sort_order, is_active, created_at, updated_at`,
    [
      question?.trim() || null,
      answer?.trim() || null,
      sortOrder !== undefined ? Number(sortOrder) : null,
      isActive !== undefined ? Boolean(isActive) : null,
      id,
    ]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return formatFaq(result.rows[0]);
}

export async function deleteFaq(id) {
  const result = await pool.query(
    'DELETE FROM faqs WHERE id = $1 RETURNING id, question',
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}
