import pool from '../db.js';
import { getBookingSettings } from './bookingSettings.js';
import { addDaysToDateStr, getTodayDateStr, zonedTimeToUtc } from '../utils/timezone.js';

const PRESET_DAYS = {
  '7d': 7,
  '10d': 10,
  '90d': 90,
};

export function resolveAnalyticsRange({ preset = '7d', from, to, timezone }) {
  const tz = timezone || 'America/Toronto';
  const today = getTodayDateStr(tz);

  if (preset === 'custom') {
    if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
      throw new Error('Custom range requires valid from and to dates (YYYY-MM-DD)');
    }
    if (from > to) {
      throw new Error('Start date must be on or before end date');
    }
    return {
      preset: 'custom',
      from,
      to,
      timezone: tz,
      startUtc: zonedTimeToUtc(from, 0, 0, tz),
      endUtc: zonedTimeToUtc(addDaysToDateStr(to, 1, tz), 0, 0, tz),
    };
  }

  const days = PRESET_DAYS[preset] || PRESET_DAYS['7d'];
  const rangeFrom = addDaysToDateStr(today, -(days - 1), tz);

  return {
    preset,
    from: rangeFrom,
    to: today,
    timezone: tz,
    startUtc: zonedTimeToUtc(rangeFrom, 0, 0, tz),
    endUtc: zonedTimeToUtc(addDaysToDateStr(today, 1, tz), 0, 0, tz),
  };
}

function num(value) {
  return value != null ? Number(value) : 0;
}

export async function getDashboardAnalytics({ preset = '7d', from, to } = {}) {
  const settings = await getBookingSettings();
  const range = resolveAnalyticsRange({ preset, from, to, timezone: settings.timezone });
  const params = [range.startUtc.toISOString(), range.endUtc.toISOString()];

  const summaryResult = await pool.query(
    `SELECT
       COUNT(*)::int AS total_bookings,
       COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE status = 'technician_assigned')::int AS technician_assigned,
       COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
       COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled,
       COALESCE(SUM(total_price) FILTER (WHERE status <> 'cancelled'), 0)::numeric AS total_revenue,
       COALESCE(SUM(service_price) FILTER (WHERE status <> 'cancelled'), 0)::numeric AS service_revenue,
       COALESCE(SUM(materials_total) FILTER (WHERE status <> 'cancelled'), 0)::numeric AS materials_revenue,
       COALESCE(SUM(total_price) FILTER (WHERE status = 'completed'), 0)::numeric AS completed_revenue
     FROM bookings
     WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz`,
    params
  );

  const summaryRow = summaryResult.rows[0];
  const totalBookings = summaryRow.total_bookings;
  const completed = summaryRow.completed;
  const completionRate = totalBookings > 0 ? Math.round((completed / totalBookings) * 1000) / 10 : 0;
  const avgBookingValue = totalBookings > 0
    ? Math.round((num(summaryRow.total_revenue) / totalBookings) * 100) / 100
    : 0;

  const customersResult = await pool.query(
    `SELECT COUNT(DISTINCT customer_user_id)::int AS count
     FROM bookings
     WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz
       AND customer_user_id IS NOT NULL`,
    params
  );

  const techniciansResult = await pool.query(
    `SELECT COUNT(DISTINCT technician_user_id)::int AS count
     FROM bookings
     WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz
       AND technician_user_id IS NOT NULL`,
    params
  );

  const timelineResult = await pool.query(
    `SELECT
       (created_at AT TIME ZONE $3)::date AS day,
       COUNT(*)::int AS bookings,
       COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
       COALESCE(SUM(total_price) FILTER (WHERE status <> 'cancelled'), 0)::numeric AS revenue
     FROM bookings
     WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz
     GROUP BY day
     ORDER BY day`,
    [...params, range.timezone]
  );

  const statusResult = await pool.query(
    `SELECT status,
            COUNT(*)::int AS count,
            COALESCE(SUM(total_price), 0)::numeric AS revenue
     FROM bookings
     WHERE created_at >= $1::timestamptz AND created_at < $2::timestamptz
     GROUP BY status
     ORDER BY count DESC`,
    params
  );

  const servicesResult = await pool.query(
    `SELECT s.name AS service_name,
            COUNT(*)::int AS count,
            COALESCE(SUM(bs.price), 0)::numeric AS revenue
     FROM booking_services bs
     JOIN bookings b ON b.id = bs.booking_id
     JOIN services s ON s.id = bs.service_id
     WHERE b.created_at >= $1::timestamptz AND b.created_at < $2::timestamptz
       AND b.status <> 'cancelled'
     GROUP BY s.id, s.name
     ORDER BY count DESC, revenue DESC
     LIMIT 8`,
    params
  );

  const locationsResult = await pool.query(
    `SELECT l.name AS location_name,
            l.region,
            pl.name AS parent_name,
            COUNT(*)::int AS count,
            COALESCE(SUM(b.total_price) FILTER (WHERE b.status <> 'cancelled'), 0)::numeric AS revenue
     FROM bookings b
     JOIN service_locations l ON l.id = b.service_location_id
     LEFT JOIN service_locations pl ON pl.id = l.parent_id
     WHERE b.created_at >= $1::timestamptz AND b.created_at < $2::timestamptz
     GROUP BY l.id, l.name, l.region, pl.name
     ORDER BY count DESC, revenue DESC
     LIMIT 8`,
    params
  );

  const techniciansLeaderboard = await pool.query(
    `SELECT u.first_name,
            u.last_name,
            COUNT(*)::int AS bookings,
            COUNT(*) FILTER (WHERE b.status = 'completed')::int AS completed,
            COALESCE(SUM(b.total_price) FILTER (WHERE b.status = 'completed'), 0)::numeric AS revenue
     FROM bookings b
     JOIN users u ON u.id = b.technician_user_id
     WHERE b.created_at >= $1::timestamptz AND b.created_at < $2::timestamptz
     GROUP BY u.id, u.first_name, u.last_name
     ORDER BY bookings DESC, revenue DESC
     LIMIT 8`,
    params
  );

  const materialsResult = await pool.query(
    `SELECT bm.name,
            COALESCE(SUM(bm.quantity), 0)::numeric AS quantity,
            bm.unit,
            COALESCE(SUM(bm.line_total), 0)::numeric AS revenue,
            COUNT(*)::int AS line_count
     FROM booking_materials bm
     JOIN bookings b ON b.id = bm.booking_id
     WHERE b.created_at >= $1::timestamptz AND b.created_at < $2::timestamptz
     GROUP BY bm.name, bm.unit
     ORDER BY revenue DESC, line_count DESC
     LIMIT 8`,
    params
  );

  return {
    range: {
      preset: range.preset,
      from: range.from,
      to: range.to,
      timezone: range.timezone,
    },
    summary: {
      totalBookings,
      pending: summaryRow.pending,
      technicianAssigned: summaryRow.technician_assigned,
      completed,
      cancelled: summaryRow.cancelled,
      totalRevenue: num(summaryRow.total_revenue),
      serviceRevenue: num(summaryRow.service_revenue),
      materialsRevenue: num(summaryRow.materials_revenue),
      completedRevenue: num(summaryRow.completed_revenue),
      avgBookingValue,
      completionRate,
      uniqueCustomers: customersResult.rows[0]?.count || 0,
      activeTechnicians: techniciansResult.rows[0]?.count || 0,
    },
    timeline: timelineResult.rows.map((row) => ({
      date: row.day instanceof Date ? row.day.toISOString().slice(0, 10) : String(row.day).slice(0, 10),
      bookings: row.bookings,
      completed: row.completed,
      revenue: num(row.revenue),
    })),
    byStatus: statusResult.rows.map((row) => ({
      status: row.status,
      count: row.count,
      revenue: num(row.revenue),
    })),
    topServices: servicesResult.rows.map((row) => ({
      serviceName: row.service_name,
      count: row.count,
      revenue: num(row.revenue),
    })),
    topLocations: locationsResult.rows.map((row) => ({
      locationName: row.parent_name ? `${row.location_name} (${row.parent_name})` : row.location_name,
      region: row.region,
      count: row.count,
      revenue: num(row.revenue),
    })),
    topTechnicians: techniciansLeaderboard.rows.map((row) => ({
      name: [row.first_name, row.last_name].filter(Boolean).join(' '),
      bookings: row.bookings,
      completed: row.completed,
      revenue: num(row.revenue),
    })),
    topMaterials: materialsResult.rows.map((row) => ({
      name: row.name,
      quantity: num(row.quantity),
      unit: row.unit,
      revenue: num(row.revenue),
      lineCount: row.line_count,
    })),
  };
}
