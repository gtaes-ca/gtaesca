import { Router } from 'express';
import pool from '../db.js';
import { getPublicServiceById, getPublicServiceBySlug, listPublicServices } from '../services/publicServices.js';

const router = Router();

router.get('/list', async (_req, res) => {
  const services = await listPublicServices();
  return res.json({ services });
});

router.get('/items/:id', async (req, res) => {
  const service = await getPublicServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  return res.json({ service });
});

router.get('/slug/:slug', async (req, res) => {
  const service = await getPublicServiceBySlug(req.params.slug);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  return res.json({ service });
});

router.get('/', async (_req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.name, c.sort_order,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', s.id,
                  'name', s.name,
                  'description', s.description,
                  'durationMinutes', s.duration_minutes,
                  'price', s.price,
                  'sortOrder', s.sort_order
                )
                ORDER BY s.sort_order
              ) FILTER (WHERE s.id IS NOT NULL),
              '[]'
            ) AS services
     FROM service_categories c
     LEFT JOIN services s ON s.category_id = c.id
     GROUP BY c.id
     ORDER BY c.sort_order`
  );

  return res.json({
    categories: result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      sortOrder: row.sort_order,
      services: row.services,
    })),
  });
});

export default router;
