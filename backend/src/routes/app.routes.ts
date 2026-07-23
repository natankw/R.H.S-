import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadApp, getApps, deleteApp, installApp, uninstallApp } from '../controllers/app.controller';
import multer from 'multer';
import fs from 'fs';

const router = Router();

const uploadDir = './uploads/apps';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadApp);
router.get('/', getApps);
router.delete('/:id', deleteApp);
router.post('/:id/install', installApp);
router.post('/:id/uninstall', uninstallApp);

export default router;
