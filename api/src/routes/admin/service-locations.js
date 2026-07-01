import { Router } from 'express';
import pool from '../../db.js';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';

const router = Router();

const REGION_LABELS = {
  gta: 'Greater Toronto Area',
  nearby: 'Nearby Service Areas Outside the GTA',
};

function formatLocation(row) {
  return {
    id: row.id,
    region: row.region,
    regionLabel: REGION_LABELS[row.region] || row.region,
    name: row.name,
    parentId: row.parent_id,
    parentName: row.parent_name || null,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

const LIST_QUERY = `
  SELECT l.id, l.region, l.name, l.parent_id, l.sort_order, l.created_at,
         p.name AS parent_name
  FROM service_locations l
  LEFT JOIN service_locations p ON p.id = l.parent_id
`;

router.get('/', authenticate, requirePageAccess('management.service-locations'), async (req, res) => {
  const { region } = req.query;
  const conditions = [];
  const params = [];

  if (region) {
    params.push(region);
    conditions.push(`l.region = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await pool.query(
    `${LIST_QUERY}
     ${where}
     ORDER BY l.region, COALESCE(p.sort_order, l.sort_order), l.sort_order, l.name`,
    params
  );

  return res.json({ locations: result.rows.map(formatLocation) });
});

router.get('/:id', authenticate, requirePageAccess('management.service-locations'), async (req, res) => {
  const result = await pool.query(
    `${LIST_QUERY} WHERE l.id = $1`,
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Service location not found' });
  }

  return res.json({ location: formatLocation(result.rows[0]) });
});

router.post('/', authenticate, requirePageAccess('management.service-locations'), async (req, res) => {
  const { region, name, parentId, sortOrder } = req.body;

  if (!region || !['gta', 'nearby'].includes(region)) {
    return res.status(400).json({ error: 'Region must be gta or nearby' });
  }
  if (!name?.trim()) {
    return res.status(400).json({ error: 'Location name is required' });
  }

  let resolvedParentId = parentId ? Number(parentId) : null;

  if (resolvedParentId) {
    const parent = await pool.query(
      'SELECT id, region, parent_id FROM service_locations WHERE id = $1',
      [resolvedParentId]
    );
    if (parent.rowCount === 0) {
      return res.status(400).json({ error: 'Parent location not found' });
    }
    if (parent.rows[0].region !== region) {
      return res.status(400).json({ error: 'Parent location must be in the same region' });
    }
    if (parent.rows[0].parent_id !== null) {
      return res.status(400).json({ error: 'Sub-areas can only be added under a top-level location' });
    }
    if (region === 'nearby') {
      return res.status(400).json({ error: 'Nearby locations cannot have sub-areas' });
    }
  }

  try {
    const result = await pool.query(
      `INSERT INTO service_locations (region, name, parent_id, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING id, region, name, parent_id, sort_order, created_at`,
      [region, name.trim(), resolvedParentId, Number(sortOrder) || 0]
    );

    let parentName = null;
    if (resolvedParentId) {
      const parentResult = await pool.query('SELECT name FROM service_locations WHERE id = $1', [resolvedParentId]);
      parentName = parentResult.rows[0]?.name || null;
    }

    return res.status(201).json({
      location: formatLocation({ ...result.rows[0], parent_name: parentName }),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A location with this name already exists in this area' });
    }
    throw error;
  }
});

router.patch('/:id', authenticate, requirePageAccess('management.service-locations'), async (req, res) => {
  const { name, parentId, sortOrder } = req.body;

  const existing = await pool.query('SELECT * FROM service_locations WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Service location not found' });
  }

  const current = existing.rows[0];
  let resolvedParentId = parentId !== undefined
    ? (parentId ? Number(parentId) : null)
    : current.parent_id;

  if (Number(req.params.id) === resolvedParentId) {
    return res.status(400).json({ error: 'A location cannot be its own parent' });
  }

  if (resolvedParentId) {
    const parent = await pool.query(
      'SELECT id, region, parent_id FROM service_locations WHERE id = $1',
      [resolvedParentId]
    );
    if (parent.rowCount === 0) {
      return res.status(400).json({ error: 'Parent location not found' });
    }
    if (parent.rows[0].region !== current.region) {
      return res.status(400).json({ error: 'Parent location must be in the same region' });
    }
    if (parent.rows[0].parent_id !== null) {
      return res.status(400).json({ error: 'Sub-areas can only be added under a top-level location' });
    }
    if (current.region === 'nearby') {
      return res.status(400).json({ error: 'Nearby locations cannot have sub-areas' });
    }

    const childCount = await pool.query(
      'SELECT COUNT(*)::int AS count FROM service_locations WHERE parent_id = $1',
      [req.params.id]
    );
    if (childCount.rows[0].count > 0) {
      return res.status(400).json({ error: 'Cannot assign a parent to a location that already has sub-areas' });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE service_locations
       SET name = COALESCE($1, name),
           parent_id = $2,
           sort_order = COALESCE($3, sort_order)
       WHERE id = $4
       RETURNING id, region, name, parent_id, sort_order, created_at`,
      [
        name?.trim() || null,
        resolvedParentId,
        sortOrder !== undefined ? Number(sortOrder) : null,
        req.params.id,
      ]
    );

    const parentResult = resolvedParentId
      ? await pool.query('SELECT name FROM service_locations WHERE id = $1', [resolvedParentId])
      : { rows: [] };

    return res.json({
      location: formatLocation({
        ...result.rows[0],
        parent_name: parentResult.rows[0]?.name || null,
      }),
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A location with this name already exists in this area' });
    }
    throw error;
  }
});

router.delete('/:id', authenticate, requirePageAccess('management.service-locations'), async (req, res) => {
  const result = await pool.query(
    'DELETE FROM service_locations WHERE id = $1 RETURNING id, name, region',
    [req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Service location not found' });
  }

  return res.json({
    message: 'Service location deleted successfully',
    location: result.rows[0],
  });
});

export default router;
