import { Router } from 'express';
import { getProjectById, getProjectBySlug } from '../services/webContent.js';

const router = Router();

router.get('/items/:id', async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

router.get('/slug/:slug', async (req, res) => {
  const project = await getProjectBySlug(req.params.slug);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

export default router;
