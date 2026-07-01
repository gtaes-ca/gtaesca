import { BRAND_NAME } from '../constants.js';
import { formatCurrency } from '../utils/currency.js';
import { formatBookingDateTime } from '../utils/formatDateTime.js';
import { getBookingSettings } from './bookingSettings.js';

const USEPLUNK_API_KEY =
  process.env.USEPLUNK_API_KEY ||
  process.env.PLUNK_SECRET_KEY ||
  process.env.PLUNK_API_KEY;
const USEPLUNK_API_URL =
  process.env.USEPLUNK_API_URL ||
  process.env.PLUNK_SEND_URL ||
  'https://next-api.useplunk.com/v1/send';
const USEPLUNK_FROM_EMAIL =
  process.env.USEPLUNK_FROM_EMAIL ||
  process.env.USEPLUNK_FROM ||
  process.env.PLUNK_FROM_EMAIL ||
  process.env.PLUNK_FROM;
const USEPLUNK_FROM_NAME =
  process.env.USEPLUNK_FROM_NAME ||
  process.env.USEPLUNK_NAME ||
  process.env.PLUNK_NAME ||
  BRAND_NAME;
const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5173';

function plunkErrorMessage(data) {
  const error = data?.error;
  if (typeof error === 'string' && error.trim()) return error.trim();
  if (error && typeof error === 'object') {
    const parts = [];
    if (error.message) parts.push(error.message);
    if (Array.isArray(error.errors)) {
      error.errors.forEach((item) => {
        if (item?.message) parts.push(item.message);
      });
    }
    if (error.suggestion) parts.push(error.suggestion);
    if (parts.length) return parts.join(' — ');
  }
  if (data?.message) return data.message;
  return 'UsePlunk send failed';
}

async function sendViaUsePlunk({ to, subject, html, text, data }) {
  if (!USEPLUNK_API_KEY) {
    console.log('\n--- EMAIL (dev mode, UsePlunk not configured) ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log('Set USEPLUNK_API_KEY and USEPLUNK_FROM_EMAIL in .env');
    console.log('---------------------------------------------\n');
    return { devMode: true };
  }

  if (String(USEPLUNK_API_KEY).startsWith('pk_')) {
    throw new Error('UsePlunk public key (pk_*) cannot send email. Use secret key (sk_*).');
  }

  if (!USEPLUNK_FROM_EMAIL) {
    throw new Error('USEPLUNK_FROM_EMAIL is required when USEPLUNK_API_KEY is set');
  }

  const body = html || `<pre>${text || ''}</pre>`;

  const payload = {
    to,
    subject,
    body,
    from: USEPLUNK_FROM_EMAIL,
    name: USEPLUNK_FROM_NAME,
    subscribed: false,
    ...(data ? { data } : {}),
  };

  const response = await fetch(USEPLUNK_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${USEPLUNK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result?.success === false) {
    const message = plunkErrorMessage(result) || `UsePlunk API error (${response.status})`;
    console.error('[email] UsePlunk send failed:', { status: response.status, result });
    throw new Error(message);
  }

  console.log('[email] Sent via UsePlunk:', { to, subject, id: result?.data?.emails?.[0]?.email });
  return { devMode: false, provider: 'useplunk', result };
}

export async function sendInvitationEmail({ email, token, otp, userType, role }) {
  const inviteUrl = `${ADMIN_URL}/auth/accept-invitation?token=${token}`;
  const teamLabel = userType === 'operation_team' ? 'Operation Team' : 'Technicians';

  return sendViaUsePlunk({
    to: email,
    subject: `${BRAND_NAME} ${teamLabel} Invitation`,
    text: [
      `You have been invited to join ${BRAND_NAME} as ${teamLabel} (${role}).`,
      `Invitation link: ${inviteUrl}`,
      `Your verification OTP: ${otp}`,
      'This OTP expires in 30 minutes.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>${BRAND_NAME} Team Invitation</h2>
        <p>You have been invited to join ${BRAND_NAME} as <strong>${teamLabel}</strong> (${role}).</p>
        <p><a href="${inviteUrl}" style="display:inline-block;padding:12px 20px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;">Accept Invitation</a></p>
        <p>Your verification OTP: <strong style="font-size:20px;letter-spacing:2px;">${otp}</strong></p>
        <p style="color:#666;">This OTP expires in 30 minutes.</p>
        <p style="color:#666;font-size:12px;">If the button does not work, copy this link:<br>${inviteUrl}</p>
      </div>
    `,
    data: {
      otp: { value: otp, persistent: false },
      inviteUrl: { value: inviteUrl, persistent: false },
      teamLabel: { value: teamLabel, persistent: false },
      role: { value: role, persistent: false },
    },
  });
}

export async function sendPasswordResetEmail({ email, otp }) {
  const resetUrl = `${ADMIN_URL}/auth/reset-pass-confirm?email=${encodeURIComponent(email)}`;

  return sendViaUsePlunk({
    to: email,
    subject: `${BRAND_NAME} Password Reset`,
    text: [
      `You requested a password reset for your ${BRAND_NAME} account.`,
      `Reset page: ${resetUrl}`,
      `Your OTP: ${otp}`,
      'This OTP expires in 15 minutes.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>You requested a password reset for your ${BRAND_NAME} account.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a></p>
        <p>Your OTP: <strong style="font-size:20px;letter-spacing:2px;">${otp}</strong></p>
        <p style="color:#666;">This OTP expires in 15 minutes.</p>
        <p style="color:#666;font-size:12px;">If the button does not work, copy this link:<br>${resetUrl}</p>
      </div>
    `,
    data: {
      otp: { value: otp, persistent: false },
      resetUrl: { value: resetUrl, persistent: false },
    },
  });
}

function locationLabel(booking) {
  if (booking.locationParentName) {
    return `${booking.locationName} (${booking.locationParentName})`;
  }
  return booking.locationName;
}

function bookingServicesText(booking) {
  if (booking.services?.length > 1) {
    return booking.services
      .map((service) => `  - ${service.serviceName} (${formatCurrency(service.price)})`)
      .join('\n');
  }
  return booking.serviceName;
}

function bookingServicesHtml(booking) {
  if (booking.services?.length > 1) {
    const items = booking.services
      .map((service) => `<li>${service.serviceName} — ${formatCurrency(service.price)}</li>`)
      .join('');
    return `<ul style="margin:0;padding-left:20px;">${items}</ul>`;
  }
  return booking.serviceName;
}

function bookingMaterialsText(booking) {
  if (!booking.materials?.length) return '';
  return booking.materials
    .map((item) => `  - ${item.name} (${item.quantity} ${item.unit} @ ${formatCurrency(item.unitPrice)}) = ${formatCurrency(item.lineTotal)}`)
    .join('\n');
}

function bookingMaterialsHtml(booking) {
  if (!booking.materials?.length) return '';
  const rows = booking.materials
    .map((item) => `
      <tr>
        <td style="padding:6px 0;">${item.name}</td>
        <td style="padding:6px 0;text-align:right;">${item.quantity} ${item.unit}</td>
        <td style="padding:6px 0;text-align:right;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding:6px 0;text-align:right;"><strong>${formatCurrency(item.lineTotal)}</strong></td>
      </tr>
    `)
    .join('');

  return `
    <table style="width:100%;border-collapse:collapse;margin:12px 0;">
      <thead>
        <tr style="border-bottom:1px solid #ddd;">
          <th style="padding:6px 0;text-align:left;">Material</th>
          <th style="padding:6px 0;text-align:right;">Qty</th>
          <th style="padding:6px 0;text-align:right;">Unit</th>
          <th style="padding:6px 0;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function bookingChargesText(booking) {
  const lines = [`Service charge: ${formatCurrency(booking.servicePrice)}`];
  if (booking.materialsTotal > 0) {
    lines.push(`Materials: ${formatCurrency(booking.materialsTotal)}`);
    lines.push(`Total: ${formatCurrency(booking.totalPrice)}`);
  }
  return lines.join('\n');
}

function bookingChargesHtml(booking) {
  if (!booking.materialsTotal) {
    return `<tr><td style="padding:8px 0;color:#666;">Service charge</td><td style="padding:8px 0;"><strong>${formatCurrency(booking.servicePrice)}</strong></td></tr>`;
  }

  return `
    <tr><td style="padding:8px 0;color:#666;">Services subtotal</td><td style="padding:8px 0;"><strong>${formatCurrency(booking.servicePrice)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#666;vertical-align:top;">Materials</td><td style="padding:8px 0;">${bookingMaterialsHtml(booking)}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">Materials subtotal</td><td style="padding:8px 0;"><strong>${formatCurrency(booking.materialsTotal)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#666;">Total charge</td><td style="padding:8px 0;"><strong>${formatCurrency(booking.totalPrice)}</strong></td></tr>
  `;
}

export async function sendBookingConfirmationEmail({ booking, activationUrl = null }) {
  const technicianName = [booking.technicianFirstName, booking.technicianLastName].filter(Boolean).join(' ') || 'Assigned team member';
  const areaLabel = locationLabel(booking);
  const { timezone } = await getBookingSettings();
  const scheduledLabel = formatBookingDateTime(booking.scheduledAt, timezone);

  const activationBlock = activationUrl
    ? `
        <div style="margin:24px 0;padding:16px;background:#f0f7ff;border-radius:8px;border:1px solid #cfe2ff;">
          <p style="margin:0 0 12px;"><strong>Create your customer account</strong></p>
          <p style="margin:0 0 12px;color:#444;">Activate your account to view this booking and manage future service requests online.</p>
          <p style="margin:0;"><a href="${activationUrl}" style="display:inline-block;padding:12px 20px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;">Activate Account</a></p>
          <p style="color:#666;font-size:12px;margin:12px 0 0;">If the button does not work, copy this link:<br>${activationUrl}</p>
        </div>
      `
    : '';

  const activationText = activationUrl
    ? [
        '',
        'Create your customer account to view this booking online:',
        activationUrl,
        'This link expires in 7 days.',
      ].join('\n')
    : '';

  return sendViaUsePlunk({
    to: booking.clientEmail,
    subject: `${BRAND_NAME} Booking Received — ${booking.referenceCode}`,
    text: [
      `Thank you for booking with ${BRAND_NAME}.`,
      `Reference: ${booking.referenceCode}`,
      'Status: Pending review',
      `Service${booking.services?.length > 1 ? 's' : ''}: ${bookingServicesText(booking)}`,
      `Service charge: ${formatCurrency(booking.servicePrice)}`,
      `Service area: ${areaLabel}`,
      `Preferred technician: ${technicianName}`,
      `Scheduled: ${scheduledLabel}`,
      `Phone: ${booking.clientPhone || 'Not provided'}`,
      booking.clientAddress ? `Address: ${booking.clientAddress}` : '',
      booking.notes ? `Notes: ${booking.notes}` : '',
      'Our team will confirm your booking shortly.',
      activationText,
    ].filter(Boolean).join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Received</h2>
        <p>Thank you for choosing <strong>${BRAND_NAME}</strong>. Your service request has been submitted.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;color:#666;">Reference</td><td style="padding:8px 0;"><strong>${booking.referenceCode}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666;">Status</td><td style="padding:8px 0;">Pending</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top;">Service${booking.services?.length > 1 ? 's' : ''}</td><td style="padding:8px 0;">${bookingServicesHtml(booking)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Service charge</td><td style="padding:8px 0;"><strong>${formatCurrency(booking.servicePrice)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666;">Service area</td><td style="padding:8px 0;">${areaLabel}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Technician</td><td style="padding:8px 0;">${technicianName}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Scheduled</td><td style="padding:8px 0;">${scheduledLabel}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Phone</td><td style="padding:8px 0;">${booking.clientPhone || 'Not provided'}</td></tr>
          ${booking.clientAddress ? `<tr><td style="padding:8px 0;color:#666;">Address</td><td style="padding:8px 0;">${booking.clientAddress}</td></tr>` : ''}
        </table>
        ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
        <p style="color:#666;">Our team will review and confirm your booking shortly.</p>
        ${activationBlock}
      </div>
    `,
  });
}

const STATUS_EMAIL_COPY = {
  technician_assigned: {
    subject: 'Technician Assigned',
    message: 'A technician has been assigned to your service request.',
  },
  completed: {
    subject: 'Service Completed',
    message: 'Your electrical service has been marked as completed. Thank you for choosing us!',
  },
  cancelled: {
    subject: 'Booking Cancelled',
    message: 'Your service booking has been cancelled. Contact us if you need to reschedule.',
  },
};

export async function sendBookingStatusEmail({ booking, status }) {
  const copy = STATUS_EMAIL_COPY[status];
  if (!copy) return null;

  const technicianName = [booking.technicianFirstName, booking.technicianLastName].filter(Boolean).join(' ') || 'Our team';
  const { timezone } = await getBookingSettings();
  const scheduledLabel = formatBookingDateTime(booking.scheduledAt, timezone);
  const materialsText = bookingMaterialsText(booking);

  return sendViaUsePlunk({
    to: booking.clientEmail,
    subject: `${BRAND_NAME} ${copy.subject} — ${booking.referenceCode}`,
    text: [
      copy.message,
      `Reference: ${booking.referenceCode}`,
      `Service${booking.services?.length > 1 ? 's' : ''}: ${bookingServicesText(booking)}`,
      bookingChargesText(booking),
      materialsText ? `Materials used:\n${materialsText}` : '',
      `Service area: ${locationLabel(booking)}`,
      `Technician: ${technicianName}`,
      `Scheduled: ${scheduledLabel}`,
    ].filter(Boolean).join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${copy.subject}</h2>
        <p>${copy.message}</p>
        <p><strong>Reference:</strong> ${booking.referenceCode}</p>
        <p><strong>Service${booking.services?.length > 1 ? 's' : ''}:</strong> ${bookingServicesHtml(booking)}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          ${bookingChargesHtml(booking)}
        </table>
        <p><strong>Service area:</strong> ${locationLabel(booking)}</p>
        <p><strong>Technician:</strong> ${technicianName}</p>
        <p><strong>Scheduled:</strong> ${scheduledLabel}</p>
      </div>
    `,
  });
}
