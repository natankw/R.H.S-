import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getLogs, getAutomationLogs } from '../controllers/log.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getLogs);
router.get('/automation/:automationId', getAutomationLogs);

export default router;
