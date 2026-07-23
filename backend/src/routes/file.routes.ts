import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadFile, getFiles, deleteFile, renameFile, downloadFile } from '../controllers/file.controller';
import multer from 'multer';
import fs from 'fs';

const router = Router();

const uploadDir = './uploads/files';
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

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);
router.put('/:id/rename', renameFile);
router.get('/:id/download', downloadFile);

export default router;
