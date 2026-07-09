import { Router } from 'express';
import { getProjectById } from '../services/webContent.js';

const router = Router();

router.get('/items/:id', async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

export default router;
