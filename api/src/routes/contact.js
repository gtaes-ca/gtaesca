import { Router } from 'express';
import { sendContactQuoteEmail } from '../services/email.js';
import {
  getContactPageSettingsContent,
  getTopbarContent,
} from '../services/webContent.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlaceholderEmail(email) {
  const value = String(email || '').trim().toLowerCase();
  if (!value) return true;
  return (
    value === 'example@gamil.com'
    || value === 'example@gmail.com'
    || value.endsWith('@example.com')
    || value.endsWith('@example.org')
    || value.endsWith('@gamil.com') // common typo for gmail.com
  );
}

function pushUniqueEmail(list, seen, candidate) {
  const email = String(candidate || '').trim();
  if (!email || isPlaceholderEmail(email) || !EMAIL_RE.test(email)) return;
  const key = email.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  list.push(email);
}

async function resolveQuoteRecipientEmails() {
  const [settings, topbar] = await Promise.all([
    getContactPageSettingsContent(),
    getTopbarContent(),
  ]);

  const recipients = [];
  const seen = new Set();

  for (const email of settings.recipientEmails || []) {
    pushUniqueEmail(recipients, seen, email);
  }

  // Fallbacks when CMS recipients are empty
  if (!recipients.length) {
    for (const candidate of [
      settings.recipientEmail,
      settings.displayEmail,
      topbar.email,
      settings.plunkFromEmail,
    ]) {
      pushUniqueEmail(recipients, seen, candidate);
    }
  }

  return recipients;
}

router.post('/quote', async (req, res) => {
  try {
    const { name, email, phone, company, services, serviceIds, message } = req.body || {};
    const safeName = String(name || '').trim();
    const safeEmail = String(email || '').trim();
    const safeMessage = String(message || '').trim();
    const selectedServices = Array.isArray(services)
      ? services.map((item) => String(item || '').trim()).filter(Boolean)
      : [];

    if (!safeName) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!safeEmail || !EMAIL_RE.test(safeEmail)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!safeMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const recipientEmails = await resolveQuoteRecipientEmails();
    if (!recipientEmails.length) {
      return res.status(503).json({
        error: 'Contact form recipient email is not configured. Set it in Admin → CMS → Contact → Recipient Email.',
      });
    }

    await sendContactQuoteEmail({
      to: recipientEmails,
      name: safeName,
      email: safeEmail,
      phone: String(phone || '').trim(),
      company: String(company || '').trim(),
      services: selectedServices,
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [],
      message: safeMessage,
    });

    return res.json({
      success: true,
      message: 'Your quote request has been emailed. Check your inbox for a confirmation.',
    });
  } catch (error) {
    console.error('[contact] quote submit failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to send message' });
  }
});

export default router;
