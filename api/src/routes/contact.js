import { Router } from 'express';
import { sendContactQuoteEmail } from '../services/email.js';
import { getContactPageSettingsContent } from '../services/webContent.js';

const router = Router();

router.post('/quote', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body || {};
    const safeName = String(name || '').trim();
    const safeEmail = String(email || '').trim();
    const safeMessage = String(message || '').trim();

    if (!safeName) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!safeMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const settings = await getContactPageSettingsContent();
    if (!settings.recipientEmail) {
      return res.status(503).json({ error: 'Contact form is not configured yet' });
    }

    await sendContactQuoteEmail({
      to: settings.recipientEmail,
      name: safeName,
      email: safeEmail,
      phone: String(phone || '').trim(),
      company: String(company || '').trim(),
      message: safeMessage,
    });

    return res.json({ success: true, message: 'Your message has been sent.' });
  } catch (error) {
    console.error('[contact] quote submit failed:', error);
    return res.status(500).json({ error: error.message || 'Failed to send message' });
  }
});

export default router;
