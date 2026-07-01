import pool from '../db.js';
import { parsePrice } from '../utils/currency.js';

export function formatBookingMaterial(row) {
  return {
    id: row.id,
    bookingId: row.booking_id,
    materialId: row.material_id,
    name: row.name,
    unit: row.unit,
    quantity: row.quantity != null ? Number(row.quantity) : 0,
    unitPrice: row.unit_price != null ? Number(row.unit_price) : 0,
    lineTotal: row.line_total != null ? Number(row.line_total) : 0,
    notes: row.notes,
    addedBy: row.added_by,
    addedByFirstName: row.added_by_first_name,
    addedByLastName: row.added_by_last_name,
    createdAt: row.created_at,
  };
}

export function parseQuantity(value) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }
  return Math.round(quantity * 100) / 100;
}

export function computeLineTotal(quantity, unitPrice) {
  return Math.round(quantity * unitPrice * 100) / 100;
}

export async function loadBookingMaterialsMap(bookingIds) {
  if (!bookingIds.length) return new Map();

  const result = await pool.query(
    `SELECT bm.*,
            u.first_name AS added_by_first_name,
            u.last_name AS added_by_last_name
     FROM booking_materials bm
     LEFT JOIN users u ON u.id = bm.added_by
     WHERE bm.booking_id = ANY($1::uuid[])
     ORDER BY bm.created_at, bm.id`,
    [bookingIds]
  );

  const map = new Map();
  for (const row of result.rows) {
    if (!map.has(row.booking_id)) map.set(row.booking_id, []);
    map.get(row.booking_id).push(formatBookingMaterial(row));
  }
  return map;
}

export async function recomputeBookingTotals(bookingId, client = pool) {
  const totals = await client.query(
    `SELECT COALESCE(SUM(line_total), 0)::numeric AS materials_total
     FROM booking_materials
     WHERE booking_id = $1`,
    [bookingId]
  );

  const materialsTotal = Number(totals.rows[0].materials_total) || 0;

  await client.query(
    `UPDATE bookings
     SET materials_total = $1,
         total_price = service_price + $1,
         updated_at = NOW()
     WHERE id = $2`,
    [materialsTotal, bookingId]
  );

  return materialsTotal;
}

export async function resolveMaterialInput({ materialId, name, unit, quantity, unitPrice }) {
  let resolvedName = name?.trim() || '';
  let resolvedUnit = unit?.trim() || 'each';
  let resolvedUnitPrice = unitPrice;

  if (materialId) {
    const materialResult = await pool.query(
      'SELECT id, name, unit, default_unit_price, is_active FROM materials WHERE id = $1',
      [materialId]
    );
    if (materialResult.rowCount === 0) {
      throw new Error('Material not found');
    }
    const material = materialResult.rows[0];
    if (!material.is_active) {
      throw new Error('Material is inactive');
    }
    resolvedName = resolvedName || material.name;
    resolvedUnit = resolvedUnit || material.unit;
    if (resolvedUnitPrice === undefined || resolvedUnitPrice === null || resolvedUnitPrice === '') {
      resolvedUnitPrice = material.default_unit_price;
    }
  }

  if (!resolvedName) {
    throw new Error('Material name is required');
  }

  const parsedQuantity = parseQuantity(quantity);
  const parsedUnitPrice = parsePrice(resolvedUnitPrice);
  const lineTotal = computeLineTotal(parsedQuantity, parsedUnitPrice);

  return {
    materialId: materialId || null,
    name: resolvedName,
    unit: resolvedUnit,
    quantity: parsedQuantity,
    unitPrice: parsedUnitPrice,
    lineTotal,
  };
}
