import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createProxy, getProxies, updateProxy, deleteProxy } from '../controllers/proxy.controller';

const router = Router();
router.use(authMiddleware);

router.post('/', createProxy);
router.get('/', getProxies);
router.put('/:id', updateProxy);
router.delete('/:id', deleteProxy);

export default router;
