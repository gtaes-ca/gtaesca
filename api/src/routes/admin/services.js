import { Router } from 'express';
import pool from '../../db.js';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';

const router = Router();

import { parsePrice } from '../../utils/currency.js';
import {
  getServiceMaterialDefaults,
  replaceServiceMaterialDefaults,
} from '../../services/serviceMaterialDefaults.js';

function formatService(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    price: row.price != null ? Number(row.price) : 0,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

const SORT_COLUMNS = {
  name: 's.name',
  categoryName: 'c.name',
  description: 's.description',
  sortOrder: 's.sort_order',
  durationMinutes: 's.duration_minutes',
  price: 's.price',
};

router.get('/', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const {
    categoryId,
    search = '',
    page = '1',
    limit = '10',
    sortBy = 'sortOrder',
    sortDir = 'asc',
  } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (pageNum - 1) * pageSize;
  const direction = String(sortDir).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const orderColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.sortOrder;

  const conditions = [];
  const params = [];

  if (categoryId) {
    params.push(categoryId);
    conditions.push(`s.category_id = $${params.length}`);
  }

  if (search?.trim()) {
    params.push(`%${search.trim()}%`);
    const idx = params.length;
    conditions.push(
      `(s.name ILIKE $${idx} OR s.description ILIKE $${idx} OR c.name ILIKE $${idx})`
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     ${where}`,
    params
  );

  const total = countResult.rows[0].total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const listParams = [...params, pageSize, offset];
  const result = await pool.query(
    `SELECT s.id, s.category_id, s.name, s.description, s.duration_minutes, s.price, s.sort_order, s.created_at,
            c.name AS category_name
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     ${where}
     ORDER BY ${orderColumn} ${direction}, s.id ASC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );

  return res.json({
    services: result.rows.map(formatService),
    pagination: {
      page: pageNum,
      limit: pageSize,
      total,
      totalPages,
    },
  });
});

router.get('/:id', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const result = await pool.query(
    `SELECT s.id, s.category_id, s.name, s.description, s.duration_minutes, s.price, s.sort_order, s.created_at,
            c.name AS category_name
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     WHERE s.id = $1`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Service not found' });
  }

  return res.json({ service: formatService(result.rows[0]) });
});

router.get('/:id/material-defaults', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const existing = await pool.query('SELECT id FROM services WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const defaults = await getServiceMaterialDefaults(req.params.id);
  return res.json({ defaults });
});

router.put('/:id/material-defaults', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const existing = await pool.query('SELECT id FROM services WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Service not found' });
  }

  try {
    const defaults = await replaceServiceMaterialDefaults(req.params.id, req.body.defaults || []);
    return res.json({ defaults });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const { categoryId, name, description, sortOrder, durationMinutes, price } = req.body;

  if (!categoryId || !name?.trim()) {
    return res.status(400).json({ error: 'Category and service name are required' });
  }

  const duration = Number(durationMinutes) || 120;
  if (duration < 15 || duration > 960) {
    return res.status(400).json({ error: 'Duration must be between 15 and 960 minutes' });
  }

  let servicePrice;
  try {
    servicePrice = parsePrice(price, { required: false });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const category = await pool.query('SELECT id FROM service_categories WHERE id = $1', [categoryId]);
  if (category.rowCount === 0) {
    return res.status(400).json({ error: 'Category not found' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO services (category_id, name, description, duration_minutes, price, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, category_id, name, description, duration_minutes, price, sort_order, created_at`,
      [categoryId, name.trim(), description?.trim() || null, duration, servicePrice, Number(sortOrder) || 0]
    );

    const categoryName = await pool.query(
      'SELECT name FROM service_categories WHERE id = $1',
      [categoryId]
    );

    return res.status(201).json({
      service: formatService({
        ...result.rows[0],
        category_name: categoryName.rows[0].name,
      }),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A service with this name already exists in the category' });
    }
    throw error;
  }
});

router.patch('/:id', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const { categoryId, name, description, sortOrder, durationMinutes, price } = req.body;

  const existing = await pool.query('SELECT id FROM services WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Service not found' });
  }

  if (durationMinutes !== undefined) {
    const duration = Number(durationMinutes);
    if (!Number.isFinite(duration) || duration < 15 || duration > 960) {
      return res.status(400).json({ error: 'Duration must be between 15 and 960 minutes' });
    }
  }

  let servicePrice;
  if (price !== undefined) {
    try {
      servicePrice = parsePrice(price, { required: false });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (categoryId) {
    const category = await pool.query('SELECT id FROM service_categories WHERE id = $1', [categoryId]);
    if (category.rowCount === 0) {
      return res.status(400).json({ error: 'Category not found' });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE services
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           duration_minutes = COALESCE($4, duration_minutes),
           price = COALESCE($5, price),
           sort_order = COALESCE($6, sort_order)
       WHERE id = $7
       RETURNING id, category_id, name, description, duration_minutes, price, sort_order, created_at`,
      [
        categoryId || null,
        name?.trim() || null,
        description !== undefined ? (description?.trim() || null) : null,
        durationMinutes !== undefined ? Number(durationMinutes) : null,
        price !== undefined ? servicePrice : null,
        sortOrder !== undefined ? Number(sortOrder) : null,
        req.params.id,
      ]
    );

    const categoryName = await pool.query(
      'SELECT name FROM service_categories WHERE id = $1',
      [result.rows[0].category_id]
    );

    return res.json({
      service: formatService({
        ...result.rows[0],
        category_name: categoryName.rows[0].name,
      }),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A service with this name already exists in the category' });
    }
    throw error;
  }
});

router.delete('/:id', authenticate, requirePageAccess('management.services'), async (req, res) => {
  const result = await pool.query(
    'DELETE FROM services WHERE id = $1 RETURNING id, name',
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Service not found' });
  }

  return res.json({
    message: 'Service deleted successfully',
    service: result.rows[0],
  });
});

export default router;
