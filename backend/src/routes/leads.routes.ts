import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/leads.controller';
import { protect } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../schemas/lead.schema';

const router = Router();

router.use(protect);

router.get('/', validate(leadQuerySchema), getLeads);
router.get('/export', exportLeads);
router.get('/:id', getLead);
router.post('/', validate(createLeadSchema), createLead);
router.patch('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', requireRole('admin'), deleteLead);

export default router;
