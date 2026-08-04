const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const DEFAULT_BOOKING_TIMEZONE = 'America/Toronto';

export const BOOKING_MODES = {
  FULL: 'full',
  WHATSAPP: 'whatsapp',
};

export const BOOK_SERVICE_CTA_LABEL = 'Book a Service';
export const BOOK_WHATSAPP_CTA_LABEL = 'Request a Free Quote';
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

/** wa.me and tel: links need a country code; GTA numbers are +1. */
const DEFAULT_COUNTRY_CODE = '1';

export function normalizeWhatsAppNumber(number) {
  let digits = String(number || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10) digits = `${DEFAULT_COUNTRY_CODE}${digits}`;
  return digits;
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

/**
 * Apple Messages (macOS + iOS/iPadOS) treats `sms:number?body=` as one To recipient.
 * Android and most other phones need `sms:+number?body=`.
 */
function usesAppleMessagesApp() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  // iPadOS 13+ can report as Macintosh
  if (navigator.platform === 'MacIntel' && Number(navigator.maxTouchPoints) > 1) return true;
  // MacBook / iMac — opens macOS Messages / iMessage
  if (/Macintosh|Mac OS X/i.test(ua)) return true;
  return false;
}

/** Native SMS / iMessage compose link (same digits as WhatsApp / contact mobile). */
export function buildSmsUrl(number, message) {
  const digits = normalizeWhatsAppNumber(number);
  if (!digits) return null;
  const body = encodeURIComponent(String(message || ''));

  if (usesAppleMessagesApp()) {
    // macOS Messages + iPhone/iPad iMessage require `&body=` (not `?body=`).
    // `?body=` puts the full quote into the To field on Apple devices.
    return `sms:${digits}&body=${body}`;
  }

  // Android and other SMS apps
  return `sms:+${digits}?body=${body}`;
}

export function openSmsMessage(number, message) {
  const url = buildSmsUrl(number, message);
  if (!url) {
    throw new Error('Mobile number is not configured');
  }

  // location.assign is the most reliable way to hand off to Messages on macOS/iOS.
  // Fall back to an anchor if navigation is blocked.
  try {
    window.location.assign(url);
  } catch {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }
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
