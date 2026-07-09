const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const DEFAULT_BOOKING_TIMEZONE = 'America/Toronto';

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
