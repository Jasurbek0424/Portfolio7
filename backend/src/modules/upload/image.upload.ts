import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const IMAGES_DIR = path.join(process.cwd(), 'uploads', 'images');

function ensureDir() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  return IMAGES_DIR;
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, ensureDir());
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = crypto.randomBytes(12).toString('hex') + ext;
    cb(null, name);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed'));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
