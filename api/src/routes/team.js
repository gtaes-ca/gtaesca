import { Router } from 'express';
import { getPublicTeamMemberById, listPublicTeamMembers } from '../services/teamMembers.js';

const router = Router();

router.get('/members', async (_req, res) => {
  const members = await listPublicTeamMembers();
  return res.json({ members });
});

router.get('/members/:id', async (req, res) => {
  const member = await getPublicTeamMemberById(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  return res.json({ member });
});

export default router;
