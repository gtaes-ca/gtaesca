import pool from '../db.js';

function formatPublicService(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    name: row.name,
    description: row.description || '',
    durationMinutes: row.duration_minutes,
    price: row.price != null ? Number(row.price) : 0,
    sortOrder: row.sort_order,
  };
}

export async function listPublicServices() {
  const result = await pool.query(
    `SELECT s.id, s.category_id, s.name, s.description, s.duration_minutes, s.price, s.sort_order,
            c.name AS category_name, c.sort_order AS category_sort_order
     FROM services s
     JOIN service_categories c ON c.id = s.category_id
     ORDER BY c.sort_order, s.sort_order, s.id`
  );

  return result.rows.map(formatPublicService);
}

export async function getPublicServiceById(serviceId) {
  const result = await pool.query(
    `SELECT s.id, s.category_id, s.name, s.description, s.duration_minutes, s.price, s.sort_order,
            c.name AS category_name
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
