import { Router } from 'express';
import { listFaqs } from '../services/faqs.js';

const router = Router();

router.get('/', async (req, res) => {
  const { search = '', page = '1', limit = '100' } = req.query;

  const result = await listFaqs({
    active: 'true',
    search,
    page,
    limit,
  });

  return res.json(result);
});

export default router;
