import pool from '../db.js';

export function formatServiceMaterialDefault(row) {
  return {
    materialId: row.material_id,
    name: row.name,
    unit: row.unit,
    defaultUnitPrice: row.default_unit_price != null ? Number(row.default_unit_price) : 0,
    defaultQuantity: row.default_quantity != null ? Number(row.default_quantity) : 1,
    sortOrder: row.sort_order,
  };
}

export async function getServiceMaterialDefaults(serviceId) {
  const result = await pool.query(
    `SELECT smd.material_id, smd.default_quantity, smd.sort_order,
            m.name, m.unit, m.default_unit_price
     FROM service_material_defaults smd
     JOIN materials m ON m.id = smd.material_id
     WHERE smd.service_id = $1 AND m.is_active = TRUE
     ORDER BY smd.sort_order, m.name`,
    [serviceId]
  );
  return result.rows.map(formatServiceMaterialDefault);
}

export async function getSuggestedMaterialsForServiceIds(serviceIds) {
  if (!serviceIds?.length) return [];

  const result = await pool.query(
    `SELECT smd.material_id, smd.default_quantity, smd.sort_order,
            m.name, m.unit, m.default_unit_price
     FROM service_material_defaults smd
     JOIN materials m ON m.id = smd.material_id
     WHERE smd.service_id = ANY($1::int[]) AND m.is_active = TRUE
     ORDER BY smd.sort_order, m.name`,
    [serviceIds]
  );

  const seen = new Map();
  for (const row of result.rows) {
    if (!seen.has(row.material_id)) {
      seen.set(row.material_id, formatServiceMaterialDefault(row));
    }
  }
  return Array.from(seen.values());
}

export async function replaceServiceMaterialDefaults(serviceId, defaults = []) {
  await pool.query('DELETE FROM service_material_defaults WHERE service_id = $1', [serviceId]);

  for (const [index, item] of defaults.entries()) {
    const materialId = Number(item.materialId);
    const defaultQuantity = Number(item.defaultQuantity) || 1;
    if (!Number.isInteger(materialId) || materialId <= 0 || defaultQuantity <= 0) {
      throw new Error('Each default must include a valid material and quantity');
    }

    const material = await pool.query(
      'SELECT id FROM materials WHERE id = $1 AND is_active = TRUE',
      [materialId]
    );
    if (material.rowCount === 0) {
      throw new Error(`Material ${materialId} is invalid or inactive`);
    }

    await pool.query(
      `INSERT INTO service_material_defaults (service_id, material_id, default_quantity, sort_order)
       VALUES ($1, $2, $3, $4)`,
      [serviceId, materialId, defaultQuantity, index]
    );
  }

  return getServiceMaterialDefaults(serviceId);
}
