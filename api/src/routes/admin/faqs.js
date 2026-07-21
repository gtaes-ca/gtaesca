import { Router } from 'express';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import {
  createFaq,
  deleteFaq,
  getFaqById,
  listFaqs,
  updateFaq,
} from '../../services/faqs.js';

const router = Router();

router.get('/', authenticate, requirePageAccess('management.cms.faq'), async (req, res) => {
  const { search = '', active, page = '1', limit = '20' } = req.query;
  const result = await listFaqs({ search, active, page, limit });
  return res.json(result);
});

router.get('/:id', authenticate, requirePageAccess('management.cms.faq'), async (req, res) => {
  const faq = await getFaqById(req.params.id);

  if (!faq) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  return res.json({ faq });
});

router.post('/', authenticate, requirePageAccess('management.cms.faq'), async (req, res) => {
  const { question, answer, sortOrder, isActive } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!answer?.trim()) {
    return res.status(400).json({ error: 'Answer is required' });
  }

  const faq = await createFaq({ question, answer, sortOrder, isActive });
  return res.status(201).json({ faq });
});

router.patch('/:id', authenticate, requirePageAccess('management.cms.faq'), async (req, res) => {
  const { question, answer, sortOrder, isActive } = req.body;

  const existing = await getFaqById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  if (question !== undefined && !question?.trim()) {
    return res.status(400).json({ error: 'Question cannot be empty' });
  }

  if (answer !== undefined && !answer?.trim()) {
    return res.status(400).json({ error: 'Answer cannot be empty' });
  }

  const faq = await updateFaq(req.params.id, { question, answer, sortOrder, isActive });
  return res.json({ faq });
});

router.delete('/:id', authenticate, requirePageAccess('management.cms.faq'), async (req, res) => {
  const deleted = await deleteFaq(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  return res.json({
    message: 'FAQ deleted successfully',
    faq: deleted,
  });
});

export default router;
