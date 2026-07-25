import pool from '../db.js';
import { ensureUniqueSlug, slugify } from '../utils/slug.js';

function formatPublicService(row) {
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    description: row.description || '',
    image: row.image_url || '',
    durationMinutes: row.duration_minutes,
    price: row.price != null ? Number(row.price) : 0,
    sortOrder: row.sort_order,
  };
}

const SERVICE_SELECT = `SELECT s.id, s.slug, s.category_id, s.name, s.description, s.image_url, s.duration_minutes, s.price, s.sort_order,
            c.name AS category_name, c.sort_order AS category_sort_order`;

export async function listPublicServices({ group } = {}) {
  const params = [];
  let categoryFilter = '';

  if (group === 'commercial') {
    categoryFilter = `WHERE lower(c.name) LIKE '%commercial%'`;
  } else if (group === 'residential') {
    categoryFilter = `WHERE lower(c.name) NOT LIKE '%commercial%'`;
  }

  const result = await pool.query(
    `${SERVICE_SELECT}
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     ${categoryFilter}
     ORDER BY c.sort_order, s.sort_order, s.id`,
    params
  );

  return result.rows.map(formatPublicService);
}

export async function getPublicServiceById(serviceId) {
  const result = await pool.query(
    `${SERVICE_SELECT}
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     WHERE s.id = $1`,
    [serviceId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return formatPublicService(result.rows[0]);
}

export async function getPublicServiceBySlug(slug) {
  const normalizedSlug = slugify(slug);
  if (!normalizedSlug) {
    return null;
  }

  const result = await pool.query(
    `${SERVICE_SELECT}
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     WHERE s.slug = $1`,
    [normalizedSlug]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return formatPublicService(result.rows[0]);
}

export async function resolveServiceSlug({ slug, name, serviceId }) {
  const normalizedSlug = slugify(slug || name);
  if (!normalizedSlug) {
    throw new Error('Service slug is required');
  }

  const params = [normalizedSlug];
  let excludeClause = '';

  if (serviceId) {
    params.push(serviceId);
    excludeClause = 'AND id <> $2';
  }

  const existing = await pool.query(
    `SELECT slug FROM services WHERE slug = $1 ${excludeClause}`,
    params
  );

  if (existing.rowCount > 0) {
    throw new Error('A service with this slug already exists');
  }

  return normalizedSlug;
}

export async function generateUniqueServiceSlug(name, serviceId) {
  const baseSlug = slugify(name) || 'service';
  const params = [];
  let excludeClause = '';

  if (serviceId) {
    params.push(serviceId);
    excludeClause = 'AND id <> $1';
  }

  const result = await pool.query(
    `SELECT slug FROM services ${excludeClause ? `WHERE 1=1 ${excludeClause}` : ''}`,
    params
  );

  const usedSlugs = new Set(result.rows.map((row) => row.slug));
  return ensureUniqueSlug(baseSlug, usedSlugs);
}
