import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { uploadImage } from './image.upload';

const router = Router();

router.use(authMiddleware);

router.post(
  '/image',
  uploadImage.single('file'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }
    const url = `/uploads/images/${req.file.filename}`;
    res.json({ success: true, data: { url, filename: req.file.filename } });
  }
);

export const uploadRoutes = router;
