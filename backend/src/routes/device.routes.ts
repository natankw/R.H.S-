import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  createDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  cloneDevice,
  startDevice,
  stopDevice
} from '../controllers/device.controller';

const router = Router();
router.use(authMiddleware);

router.post('/', createDevice);
router.get('/', getDevices);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/clone', cloneDevice);
router.post('/:id/start', startDevice);
router.post('/:id/stop', stopDevice);

export default router;
