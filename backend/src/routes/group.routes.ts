import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createGroup, getGroups, updateGroup, deleteGroup } from '../controllers/group.controller';

const router = Router();
router.use(authMiddleware);

router.post('/', createGroup);
router.get('/', getGroups);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;
