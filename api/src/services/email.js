import { BRAND_NAME } from '../constants.js';
import { formatCurrency } from '../utils/currency.js';
import { formatBookingDateTime } from '../utils/formatDateTime.js';
import { getBookingSettings } from './bookingSettings.js';
import { getContactPageSettingsContent } from './webContent.js';

const ADMIN_URL = process.env.ADMIN_URL || 'http://localhost:5173';
// Current Plunk docs use next-api; override with PLUNK_API_URL if needed.
const PLUNK_API_URL_DEFAULT = 'https://next-api.useplunk.com/v1/send';
const PLUNK_TIMEOUT_MS = Number(process.env.PLUNK_TIMEOUT_MS) || 30000;

function getPlunkApiUrl() {
  return String(process.env.PLUNK_API_URL || PLUNK_API_URL_DEFAULT).trim();
}

function getPlunkApiKey() {
  return String(process.env.PLUNK_API_KEY || '')
    .trim()
    .replace(/^["']+|["']+$/g, '');
}

function formatPlunkError(data, status) {
  const err = data?.error;
  if (typeof err === 'string' && err.trim()) return err.trim();
  if (err && typeof err === 'object') {
    const parts = [err.message, err.code, err.suggestion].filter(Boolean);
    if (parts.length) return parts.join(' — ');
  }
  if (typeof data?.message === 'string' && data.message.trim()) return data.message.trim();
  if (typeof data?.raw === 'string' && data.raw.trim()) return data.raw.trim().slice(0, 200);
  return `Plunk send failed (${status})`;
}

async function loadPlunkAccount() {
  const settings = await getContactPageSettingsContent();
  const fromEmail = String(settings.plunkFromEmail || '').trim();
  const fromName = String(settings.plunkFromName || BRAND_NAME).trim();
  return { apiKey: getPlunkApiKey(), fromEmail, fromName };
}

async function sendViaPlunk({ to, subject, html, text, replyTo }) {
  const account = await loadPlunkAccount();
  const recipients = Array.isArray(to)
    ? to.map((item) => String(item || '').trim()).filter(Boolean)
    : [String(to || '').trim()].filter(Boolean);
  const safeReplyTo = String(replyTo || '').trim();

  if (!account.apiKey && !account.fromEmail) {
    console.log('\n--- EMAIL (dev mode, Plunk not configured) ---');
    console.log(`To: ${recipients.join(', ')}`);
    if (safeReplyTo) console.log(`Reply-To: ${safeReplyTo}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log('Set PLUNK_API_KEY in API .env and From Email in Admin → CMS → Contact');
    console.log('---------------------------------------------\n');
    return { devMode: true };
  }

  if (!account.apiKey) {
    throw new Error('PLUNK_API_KEY is required in the API .env');
  }
  if (account.apiKey.startsWith('pk_')) {
    throw new Error(
      'PLUNK_API_KEY looks like a public key (pk_). Use the secret key (sk_) in the API .env.',
    );
  }
  if (!account.fromEmail) {
    throw new Error('Plunk From Email is required in Admin → CMS → Contact');
  }
  if (!recipients.length) {
    throw new Error('At least one email recipient is required');
  }

  const plunkApiUrl = getPlunkApiUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PLUNK_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(plunkApiUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${account.apiKey}`,
      },
      body: JSON.stringify({
        to: recipients.length === 1 ? recipients[0] : recipients,
        subject,
        body: html || text || '',
        from: account.fromEmail,
        name: account.fromName || undefined,
        // Official docs use `reply`; some guides use `replyTo`.
        ...(safeReplyTo ? { reply: safeReplyTo, replyTo: safeReplyTo } : {}),
      }),
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Plunk request timed out after ${PLUNK_TIMEOUT_MS}ms`);
    }
    throw new Error(error?.message || 'Failed to reach Plunk API');
  } finally {
    clearTimeout(timeout);
  }

  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { raw };
  }

  if (!response.ok) {
    const message = formatPlunkError(data, response.status);
    console.error('[email] Plunk send failed:', {
      status: response.status,
      url: plunkApiUrl,
      keyPrefix: account.apiKey.slice(0, 3),
      message,
      body: data,
    });
    throw new Error(message);
  }

  console.log('[email] Sent via Plunk:', {
    to: recipients,
    subject,
    from: account.fromEmail,
    replyTo: safeReplyTo || null,
    status: response.status,
  });

  return { devMode: false, provider: 'plunk', result: data };
}

export async function sendInvitationEmail({ email, token, otp, userType, role }) {
  const inviteUrl = `${ADMIN_URL}/auth/accept-invitation?token=${token}`;
  const teamLabel = userType === 'operation_team' ? 'Operation Team' : 'Technicians';

  return sendViaPlunk({
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
  });
}

export async function sendPasswordResetEmail({ email, otp }) {
  const resetUrl = `${ADMIN_URL}/auth/reset-pass-confirm?email=${encodeURIComponent(email)}`;

  return sendViaPlunk({
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
      .map((service) => `  - ${service.serviceName}`)
      .join('\n');
  }
  return booking.serviceName;
}

function bookingServicesHtml(booking) {
  if (booking.services?.length > 1) {
    const items = booking.services
      .map((service) => `<li>${service.serviceName}</li>`)
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

  return sendViaPlunk({
    to: booking.clientEmail,
    subject: `${BRAND_NAME} Booking Received — ${booking.referenceCode}`,
    text: [
      `Thank you for booking with ${BRAND_NAME}.`,
      `Reference: ${booking.referenceCode}`,
      'Status: Pending review',
      `Service${booking.services?.length > 1 ? 's' : ''}: ${bookingServicesText(booking)}`,
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

  return sendViaPlunk({
    to: booking.clientEmail,
    subject: `${BRAND_NAME} ${copy.subject} — ${booking.referenceCode}`,
    text: [
      copy.message,
      `Reference: ${booking.referenceCode}`,
      `Service${booking.services?.length > 1 ? 's' : ''}: ${bookingServicesText(booking)}`,
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
        <p><strong>Service area:</strong> ${locationLabel(booking)}</p>
        <p><strong>Technician:</strong> ${technicianName}</p>
        <p><strong>Scheduled:</strong> ${scheduledLabel}</p>
      </div>
    `,
  });
}

export async function sendContactQuoteEmail({
  to,
  name,
  email,
  phone = '',
  company = '',
  services = [],
  message,
}) {
  const safeName = String(name || '').trim();
  const safeEmail = String(email || '').trim();
  const safePhone = String(phone || '').trim();
  const safeCompany = String(company || '').trim();
  const selectedServices = Array.isArray(services)
    ? services.map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const safeMessage = String(message || '').trim();
  const servicesLabel = selectedServices.length ? selectedServices.join(', ') : '';
  const recipients = Array.isArray(to)
    ? to.map((item) => String(item || '').trim()).filter(Boolean)
    : [String(to || '').trim()].filter(Boolean);

  const textBody = [
    'New contact form submission:',
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    safePhone ? `Phone: ${safePhone}` : '',
    servicesLabel ? `Services: ${servicesLabel}` : '',
    safeCompany ? `Company: ${safeCompany}` : '',
    '',
    'Message:',
    safeMessage,
  ].filter(Boolean).join('\n');

  const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}
        ${servicesLabel ? `<p><strong>Services:</strong> ${servicesLabel}</p>` : ''}
        ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${safeMessage}</p>
      </div>
    `;

  const teamResult = await sendViaPlunk({
    to: recipients,
    replyTo: safeEmail,
    subject: 'New Contact Form Submission',
    text: textBody,
    html: htmlBody,
  });

  // Confirmation to the person who submitted the form
  const recipientSet = new Set(recipients.map((item) => item.toLowerCase()));
  if (safeEmail && !recipientSet.has(safeEmail.toLowerCase())) {
    try {
      await sendViaPlunk({
        to: safeEmail,
        subject: `We received your quote request — ${BRAND_NAME}`,
        text: [
          `Hi ${safeName},`,
          '',
          'Thanks for contacting GTA Electric Services. We received your quote request and will get back to you soon.',
          '',
          servicesLabel ? `Services: ${servicesLabel}` : '',
          '',
          'Your message:',
          safeMessage,
        ].filter(Boolean).join('\n'),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>We received your quote request</h2>
            <p>Hi ${safeName},</p>
            <p>Thanks for contacting <strong>${BRAND_NAME}</strong>. We received your quote request and will get back to you soon.</p>
            ${servicesLabel ? `<p><strong>Services:</strong> ${servicesLabel}</p>` : ''}
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${safeMessage}</p>
          </div>
        `,
      });
    } catch (error) {
      console.warn('[email] Customer confirmation failed:', error.message);
    }
  }

  return teamResult;
}
