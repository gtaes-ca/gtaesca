import { Router } from 'express';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import { getDashboardAnalytics } from '../../services/analytics.js';

const router = Router();

router.get('/', authenticate, requirePageAccess('dashboard.analytics'), async (req, res) => {
  const { preset = '7d', from, to } = req.query;

  try {
    const analytics = await getDashboardAnalytics({ preset, from, to });
    return res.json({ analytics });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Invalid analytics range' });
  }
});

export default router;
