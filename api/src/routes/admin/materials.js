import { Router } from 'express';
import pool from '../../db.js';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import { parsePrice } from '../../utils/currency.js';

const router = Router();

const SORT_COLUMNS = {
  name: 'name',
  unit: 'unit',
  defaultUnitPrice: 'default_unit_price',
  createdAt: 'created_at',
};

function formatMaterial(row) {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    defaultUnitPrice: row.default_unit_price != null ? Number(row.default_unit_price) : 0,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get('/', authenticate, requirePageAccess('management.materials'), async (req, res) => {
  const {
    search = '',
    active,
    page = '1',
    limit = '20',
    sortBy = 'name',
    sortDir = 'asc',
  } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (pageNum - 1) * pageSize;
  const direction = String(sortDir).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const orderColumn = SORT_COLUMNS[sortBy] || SORT_COLUMNS.name;

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
    conditions.push(`(name ILIKE $${idx} OR description ILIKE $${idx} OR unit ILIKE $${idx})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM materials ${where}`,
    params
  );
  const total = countResult.rows[0].total;

  const listParams = [...params, pageSize, offset];
  const result = await pool.query(
    `SELECT id, name, unit, default_unit_price, description, is_active, created_at, updated_at
     FROM materials
     ${where}
     ORDER BY ${orderColumn} ${direction}, id ASC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );

  return res.json({
    materials: result.rows.map(formatMaterial),
    pagination: {
      page: pageNum,
      limit: pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
});

router.get('/:id', authenticate, requirePageAccess('management.materials'), async (req, res) => {
  const result = await pool.query(
    `SELECT id, name, unit, default_unit_price, description, is_active, created_at, updated_at
     FROM materials WHERE id = $1`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Material not found' });
  }

  return res.json({ material: formatMaterial(result.rows[0]) });
});

router.post('/', authenticate, requirePageAccess('management.materials'), async (req, res) => {
  const { name, unit, defaultUnitPrice, description, isActive } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Material name is required' });
  }

  let price;
  try {
    price = parsePrice(defaultUnitPrice, { required: false });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const result = await pool.query(
      `INSERT INTO materials (name, unit, default_unit_price, description, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, unit, default_unit_price, description, is_active, created_at, updated_at`,
      [
        name.trim(),
        unit?.trim() || 'each',
        price,
        description?.trim() || null,
        isActive !== false,
      ]
    );

    return res.status(201).json({ material: formatMaterial(result.rows[0]) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A material with this name already exists' });
    }
    throw error;
  }
});

router.patch('/:id', authenticate, requirePageAccess('management.materials'), async (req, res) => {
  const { name, unit, defaultUnitPrice, description, isActive } = req.body;

  const existing = await pool.query('SELECT id FROM materials WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Material not found' });
  }

  let price;
  if (defaultUnitPrice !== undefined) {
    try {
      price = parsePrice(defaultUnitPrice, { required: false });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE materials
       SET name = COALESCE($1, name),
           unit = COALESCE($2, unit),
           default_unit_price = COALESCE($3, default_unit_price),
           description = COALESCE($4, description),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, unit, default_unit_price, description, is_active, created_at, updated_at`,
      [
        name?.trim() || null,
        unit?.trim() || null,
        defaultUnitPrice !== undefined ? price : null,
        description !== undefined ? (description?.trim() || null) : null,
        isActive !== undefined ? Boolean(isActive) : null,
        req.params.id,
      ]
    );

    return res.json({ material: formatMaterial(result.rows[0]) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A material with this name already exists' });
    }
    throw error;
  }
});

router.delete('/:id', authenticate, requirePageAccess('management.materials'), async (req, res) => {
  const result = await pool.query(
    'DELETE FROM materials WHERE id = $1 RETURNING id, name',
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Material not found' });
  }

  return res.json({
    message: 'Material deleted successfully',
    material: result.rows[0],
  });
});

export default router;
