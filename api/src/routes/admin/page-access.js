import { Router } from 'express';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.js';
import { ASSIGNABLE_ROLES, ROLE_LABELS } from '../../pages.js';
import {
  getPageAccessMatrix,
  updateRolePageAccess,
} from '../../services/pageAccess.js';

const router = Router();

router.get('/', authenticate, requireSuperAdmin, async (_req, res) => {
  const matrix = await getPageAccessMatrix();
  return res.json({
    ...matrix,
    roles: ASSIGNABLE_ROLES.map((role) => ({
      role,
      label: ROLE_LABELS[role],
    })),
  });
});

router.put('/:role', authenticate, requireSuperAdmin, async (req, res) => {
  const { role } = req.params;
  const { pageKeys } = req.body;

  if (!ASSIGNABLE_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (!Array.isArray(pageKeys)) {
    return res.status(400).json({ error: 'pageKeys must be an array' });
  }

  try {
    const allowedPages = await updateRolePageAccess(role, pageKeys);
    return res.json({
      message: 'Page access updated. Active sessions for this role were signed out.',
      role,
      allowedPages,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to update page access' });
  }
});

export default router;
