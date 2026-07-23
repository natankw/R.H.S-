import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createAutomation,
  getAutomations,
  updateAutomation,
  deleteAutomation,
  runAutomation
} from '../controllers/automation.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', createAutomation);
router.get('/', getAutomations);
router.put('/:id', updateAutomation);
router.delete('/:id', deleteAutomation);
router.post('/:id/run', runAutomation);

export default router;
