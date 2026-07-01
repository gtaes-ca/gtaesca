import pool from '../db.js';

const DEFAULT_SETTINGS = {
  startHour: 8,
  endHour: 18,
  lookaheadDays: 30,
  timezone: 'America/Toronto',
  workingDays: [1, 2, 3, 4, 5],
};

function formatSettings(row) {
  if (!row) return { ...DEFAULT_SETTINGS };
  const workingDays = Array.isArray(row.working_days)
    ? row.working_days
    : JSON.parse(row.working_days || '[]');

  return {
    startHour: row.start_hour,
    endHour: row.end_hour,
    lookaheadDays: row.lookahead_days,
    timezone: row.timezone,
    workingDays: workingDays.sort((a, b) => a - b),
    updatedAt: row.updated_at,
  };
}

export async function getBookingSettings() {
  const result = await pool.query(
    `SELECT start_hour, end_hour, lookahead_days, timezone, working_days, updated_at
     FROM booking_settings
     WHERE id = 1`
  );

  if (result.rowCount === 0) {
    return { ...DEFAULT_SETTINGS };
  }

  return formatSettings(result.rows[0]);
}

export async function updateBookingSettings({
  startHour,
  endHour,
  lookaheadDays,
  timezone,
  workingDays,
}) {
  if (startHour !== undefined && (startHour < 0 || startHour > 23)) {
    throw new Error('Start hour must be between 0 and 23');
  }
  if (endHour !== undefined && (endHour < 1 || endHour > 24)) {
    throw new Error('End hour must be between 1 and 24');
  }
  if (
    startHour !== undefined &&
    endHour !== undefined &&
    startHour >= endHour
  ) {
    throw new Error('Start hour must be before end hour');
  }

  if (lookaheadDays !== undefined && (lookaheadDays < 1 || lookaheadDays > 365)) {
    throw new Error('Lookahead days must be between 1 and 365');
  }

  if (workingDays !== undefined) {
    if (!Array.isArray(workingDays) || workingDays.length === 0) {
      throw new Error('At least one working day is required');
    }
    const valid = workingDays.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);
    if (!valid) {
      throw new Error('Working days must be integers from 0 (Sunday) to 6 (Saturday)');
    }
  }

  const current = await getBookingSettings();

  const next = {
    startHour: startHour ?? current.startHour,
    endHour: endHour ?? current.endHour,
    lookaheadDays: lookaheadDays ?? current.lookaheadDays,
    timezone: timezone?.trim() || current.timezone,
    workingDays: workingDays ?? current.workingDays,
  };

  if (next.startHour >= next.endHour) {
    throw new Error('Start hour must be before end hour');
  }

  const result = await pool.query(
    `INSERT INTO booking_settings (id, start_hour, end_hour, lookahead_days, timezone, working_days, updated_at)
     VALUES (1, $1, $2, $3, $4, $5::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE
     SET start_hour = EXCLUDED.start_hour,
         end_hour = EXCLUDED.end_hour,
         lookahead_days = EXCLUDED.lookahead_days,
         timezone = EXCLUDED.timezone,
         working_days = EXCLUDED.working_days,
         updated_at = NOW()
     RETURNING start_hour, end_hour, lookahead_days, timezone, working_days, updated_at`,
    [
      next.startHour,
      next.endHour,
      next.lookaheadDays,
      next.timezone,
      JSON.stringify([...new Set(next.workingDays)].sort((a, b) => a - b)),
    ]
  );

  return formatSettings(result.rows[0]);
}
