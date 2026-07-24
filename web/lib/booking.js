const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const DEFAULT_BOOKING_TIMEZONE = 'America/Toronto';

export const BOOKING_MODES = {
  FULL: 'full',
  WHATSAPP: 'whatsapp',
};

export const BOOK_SERVICE_CTA_LABEL = 'Book a Service';
export const BOOK_WHATSAPP_CTA_LABEL = 'Request a Quote';
export const BOOK_SERVICE_CTA_HREF = '/book';
export const CONTACT_QUOTE_HREF = '/contact#quote';

export function isWhatsAppBookingMode(bookingMode) {
  return bookingMode === BOOKING_MODES.WHATSAPP;
}

export function getBookingCtaLabel(bookingMode) {
  return isWhatsAppBookingMode(bookingMode) ? BOOK_WHATSAPP_CTA_LABEL : BOOK_SERVICE_CTA_LABEL;
}

export function getBookingCtaHref(bookingMode) {
  return isWhatsAppBookingMode(bookingMode) ? CONTACT_QUOTE_HREF : BOOK_SERVICE_CTA_HREF;
}

export async function fetchPublicBookingSettings() {
  const res = await fetch(`${API_URL}/api/bookings/settings`);
  if (!res.ok) {
    throw new Error('Failed to load booking settings');
  }
  const data = await res.json();
  return data.settings || {};
}

export const BOOKING_SOURCE_LABELS = {
  web: 'Web Booking',
  admin: 'Admin Booking',
};

export function formatBookingSource(source) {
  return BOOKING_SOURCE_LABELS[source] || 'Web Booking';
}

export function formatCurrency(amount, currency = 'CAD') {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatBookingSlot(iso, timeZone = DEFAULT_BOOKING_TIMEZONE) {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-CA', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatBookingDateTime(iso, timeZone = DEFAULT_BOOKING_TIMEZONE) {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-CA', {
    timeZone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}

export function normalizeWhatsAppNumber(number) {
  return String(number || '').replace(/\D/g, '');
}

export function buildTelHref(number) {
  const digits = normalizeWhatsAppNumber(number);
  if (!digits) return null;
  return `tel:+${digits}`;
}

export function buildWhatsAppBookingMessage({
  services = [],
  location,
  technician,
  scheduledAt,
  client,
  notes,
  timezone = DEFAULT_BOOKING_TIMEZONE,
}) {
  const serviceLines = services.map((s) => `- ${s.name}`).join('\n');

  const lines = [
    'Hello, I would like to book a service:',
    '',
    '*Services:*',
    serviceLines || '- (none selected)',
    '',
    `*Service area:* ${location?.label || location?.name || '—'}`,
    `*Preferred technician:* ${technician ? `${technician.firstName} ${technician.lastName}` : '—'}`,
    `*Preferred date & time:* ${formatBookingSlot(scheduledAt, timezone)}`,
    '',
    '*Contact details:*',
    `Name: ${client.firstName} ${client.lastName}`.trim(),
    `Email: ${client.email || '—'}`,
    `Phone: ${client.phone || '—'}`,
    `Address: ${client.address || '—'}`,
  ];

  if (notes?.trim()) {
    lines.push('', `*Notes:* ${notes.trim()}`);
  }

  return lines.join('\n');
}

export function buildWhatsAppContactQuoteMessage({
  name = '',
  email = '',
  phone = '',
  services = [],
  message = '',
}) {
  const serviceLines = (services || [])
    .map((service) => {
      if (typeof service === 'string') return `- ${service}`
      const label = service?.name || ''
      const category = service?.categoryName ? ` (${service.categoryName})` : ''
      return label ? `- ${label}${category}` : null
    })
    .filter(Boolean)
    .join('\n')

  const lines = [
    'Hello, I would like to request a quote:',
    '',
    '*Contact details:*',
    `Name: ${String(name || '').trim() || '—'}`,
    `Email: ${String(email || '').trim() || '—'}`,
    `Phone: ${String(phone || '').trim() || '—'}`,
    '',
    '*Services of interest:*',
    serviceLines || '- (none selected)',
  ]

  if (String(message || '').trim()) {
    lines.push('', '*Message:*', String(message).trim())
  }

  return lines.join('\n')
}

export function buildWhatsAppBookingUrl(number, message) {
  const digits = normalizeWhatsAppNumber(number);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppBooking(number, message) {
  const url = buildWhatsAppBookingUrl(number, message);
  if (!url) {
    throw new Error('WhatsApp number is not configured');
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function getDateStrInTimezone(timeZone) {
  return new Date().toLocaleDateString('en-CA', { timeZone });
}

export function addDaysToDateStr(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

import { getAuthHeaders } from './auth';

export async function bookingFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}
