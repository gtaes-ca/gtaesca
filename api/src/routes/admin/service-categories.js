import { Router } from 'express';
import pool from '../../db.js';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';

const router = Router();

function formatCategory(row) {
  return {
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
    serviceCount: Number(row.service_count ?? 0),
    createdAt: row.created_at,
  };
}

router.get('/', authenticate, requirePageAccess('management.service-categories'), async (_req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.name, c.sort_order, c.created_at,
            COUNT(s.id)::int AS service_count
     FROM service_categories c
     LEFT JOIN services s ON s.category_id = c.id
     GROUP BY c.id
     ORDER BY c.sort_order, c.name`
  );

  return res.json({ categories: result.rows.map(formatCategory) });
});

router.get('/:id', authenticate, requirePageAccess('management.service-categories'), async (req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.name, c.sort_order, c.created_at,
            COUNT(s.id)::int AS service_count
     FROM service_categories c
     LEFT JOIN services s ON s.category_id = c.id
     WHERE c.id = $1
     GROUP BY c.id`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.json({ category: formatCategory(result.rows[0]) });
});

router.post('/', authenticate, requirePageAccess('management.service-categories'), async (req, res) => {
  const { name, sortOrder } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO service_categories (name, sort_order)
       VALUES ($1, $2)
       RETURNING id, name, sort_order, created_at`,
      [name.trim(), Number(sortOrder) || 0]
    );

    return res.status(201).json({
      category: formatCategory({ ...result.rows[0], service_count: 0 }),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A category with this name already exists' });
    }
    throw error;
  }
});

router.patch('/:id', authenticate, requirePageAccess('management.service-categories'), async (req, res) => {
  const { name, sortOrder } = req.body;

  const existing = await pool.query('SELECT id FROM service_categories WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  try {
    const result = await pool.query(
      `UPDATE service_categories
       SET name = COALESCE($1, name),
           sort_order = COALESCE($2, sort_order)
       WHERE id = $3
       RETURNING id, name, sort_order, created_at`,
      [name?.trim() || null, sortOrder !== undefined ? Number(sortOrder) : null, req.params.id]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS service_count FROM services WHERE category_id = $1',
      [req.params.id]
    );

    return res.json({
      category: formatCategory({
        ...result.rows[0],
        service_count: countResult.rows[0].service_count,
      }),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A category with this name already exists' });
    }
    throw error;
  }
});

router.delete('/:id', authenticate, requirePageAccess('management.service-categories'), async (req, res) => {
  const result = await pool.query(
    'DELETE FROM service_categories WHERE id = $1 RETURNING id, name',
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  return res.json({
    message: 'Category deleted successfully',
    category: result.rows[0],
  });
});

export default router;
