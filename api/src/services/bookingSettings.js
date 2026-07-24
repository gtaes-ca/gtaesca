import pool from '../db.js';

export const BOOKING_MODES = {
  FULL: 'full',
  WHATSAPP: 'whatsapp',
};

export const BOOKING_SYSTEM_PAGE_KEYS = [
  'dashboard.analytics',
  'management.customers',
  'management.bookings',
  'management.booking-settings',
  'management.materials',
];

const DEFAULT_SETTINGS = {
  startHour: 8,
  endHour: 18,
  lookaheadDays: 30,
  timezone: 'America/Toronto',
  workingDays: [1, 2, 3, 4, 5],
  bookingMode: BOOKING_MODES.FULL,
  companyWhatsappNumber: null,
};

export function isWhatsAppBookingMode(settings) {
  return settings?.bookingMode === BOOKING_MODES.WHATSAPP;
}

export function normalizeWhatsAppNumber(number) {
  return String(number || '').replace(/\D/g, '');
}

function validateWhatsAppNumber(number) {
  const digits = normalizeWhatsAppNumber(number);
  if (digits.length < 10 || digits.length > 15) {
    throw new Error('WhatsApp number must be 10–15 digits including country code');
  }
  return digits;
}

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
    bookingMode: row.booking_mode || BOOKING_MODES.FULL,
    companyWhatsappNumber: row.company_whatsapp_number || null,
    updatedAt: row.updated_at,
  };
}

const SETTINGS_COLUMNS = `
  start_hour, end_hour, lookahead_days, timezone, working_days,
  booking_mode, company_whatsapp_number, updated_at
`;

export async function getBookingSettings() {
  const result = await pool.query(
    `SELECT ${SETTINGS_COLUMNS}
     FROM booking_settings
     WHERE id = 1`
  );

  if (result.rowCount === 0) {
    return { ...DEFAULT_SETTINGS };
  }

  return formatSettings(result.rows[0]);
}

export function getPublicBookingSettings(settings) {
  const base = {
    startHour: settings.startHour,
    endHour: settings.endHour,
    lookaheadDays: settings.lookaheadDays,
    timezone: settings.timezone,
    workingDays: settings.workingDays,
    bookingMode: settings.bookingMode,
  };

  // Always expose when set — used for Call Now (tel:) and WhatsApp booking.
  if (settings.companyWhatsappNumber) {
    base.companyWhatsappNumber = settings.companyWhatsappNumber;
  }

  return base;
}

export async function updateBookingSettings({
  startHour,
  endHour,
  lookaheadDays,
  timezone,
  workingDays,
  bookingMode,
  companyWhatsappNumber,
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

  if (bookingMode !== undefined && !Object.values(BOOKING_MODES).includes(bookingMode)) {
    throw new Error('Invalid booking mode');
  }

  const current = await getBookingSettings();

  const next = {
    startHour: startHour ?? current.startHour,
    endHour: endHour ?? current.endHour,
    lookaheadDays: lookaheadDays ?? current.lookaheadDays,
    timezone: timezone?.trim() || current.timezone,
    workingDays: workingDays ?? current.workingDays,
    bookingMode: bookingMode ?? current.bookingMode,
    companyWhatsappNumber:
      companyWhatsappNumber !== undefined
        ? companyWhatsappNumber
        : current.companyWhatsappNumber,
  };

  if (next.startHour >= next.endHour) {
    throw new Error('Start hour must be before end hour');
  }

  if (isWhatsAppBookingMode(next)) {
    next.companyWhatsappNumber = validateWhatsAppNumber(next.companyWhatsappNumber);
  } else if (companyWhatsappNumber !== undefined && companyWhatsappNumber) {
    next.companyWhatsappNumber = validateWhatsAppNumber(companyWhatsappNumber);
  }

  const result = await pool.query(
    `INSERT INTO booking_settings (
       id, start_hour, end_hour, lookahead_days, timezone, working_days,
       booking_mode, company_whatsapp_number, updated_at
     )
     VALUES (1, $1, $2, $3, $4, $5::jsonb, $6, $7, NOW())
     ON CONFLICT (id) DO UPDATE
     SET start_hour = EXCLUDED.start_hour,
         end_hour = EXCLUDED.end_hour,
         lookahead_days = EXCLUDED.lookahead_days,
         timezone = EXCLUDED.timezone,
         working_days = EXCLUDED.working_days,
         booking_mode = EXCLUDED.booking_mode,
         company_whatsapp_number = EXCLUDED.company_whatsapp_number,
         updated_at = NOW()
     RETURNING ${SETTINGS_COLUMNS}`,
    [
      next.startHour,
      next.endHour,
      next.lookaheadDays,
      next.timezone,
      JSON.stringify([...new Set(next.workingDays)].sort((a, b) => a - b)),
      next.bookingMode,
      next.companyWhatsappNumber,
    ]
  );

  return formatSettings(result.rows[0]);
}
