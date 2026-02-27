import { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/auth';
import { uploadImage, validateMagicBytes, generateSafeFilename } from './image.upload';
import { uploadToStorage } from '../../utils/supabase';

const router = Router();

router.use(authMiddleware);

router.post(
  '/image',
  uploadImage.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' });
      return;
    }

    const buffer = req.file.buffer;

    // Validate file content (magic bytes)
    if (!validateMagicBytes(buffer, req.file.mimetype)) {
      res.status(400).json({ success: false, error: 'File content does not match its type' });
      return;
    }

    try {
      const filename = generateSafeFilename(req.file.originalname);
      const url = await uploadToStorage('images', filename, buffer, req.file.mimetype);
      res.json({ success: true, data: { url, filename } });
    } catch (err) {
      console.error('Image upload failed:', err);
      res.status(500).json({ success: false, error: 'Image upload failed' });
    }
  }
);

export const uploadRoutes = router;
