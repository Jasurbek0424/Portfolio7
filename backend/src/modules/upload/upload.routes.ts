import { Router } from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '../../middlewares/auth';
import { uploadImage, validateMagicBytes } from './image.upload';

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

    // Validate file content (magic bytes) after upload
    const filePath = path.join(req.file.destination, req.file.filename);
    try {
      const buffer = fs.readFileSync(filePath);
      if (!validateMagicBytes(buffer, req.file.mimetype)) {
        // Delete the invalid file
        fs.unlinkSync(filePath);
        res.status(400).json({ success: false, error: 'File content does not match its type' });
        return;
      }
    } catch {
      fs.unlinkSync(filePath);
      res.status(400).json({ success: false, error: 'Failed to validate file' });
      return;
    }

    const url = `/uploads/images/${req.file.filename}`;
    res.json({ success: true, data: { url, filename: req.file.filename } });
  }
);

export const uploadRoutes = router;
