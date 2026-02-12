import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const IMAGES_DIR = path.join(process.cwd(), 'uploads', 'images');

// Magic bytes for image validation
const MAGIC_BYTES: Record<string, Buffer[]> = {
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  'image/gif': [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
  'image/webp': [Buffer.from('RIFF')], // RIFF....WEBP
};

/** Validate file content matches its claimed MIME type */
export function validateMagicBytes(buffer: Buffer, mimetype: string): boolean {
  // SVG is text-based, check for XML/SVG markers
  if (mimetype === 'image/svg+xml') {
    const head = buffer.subarray(0, 512).toString('utf8').toLowerCase();
    return head.includes('<svg') && !head.includes('<script');
  }
  const signatures = MAGIC_BYTES[mimetype];
  if (!signatures) return false;
  return signatures.some((sig) => buffer.subarray(0, sig.length).equals(sig));
}

// Allowed extensions (prevent double-extension attacks like .php.jpg)
const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

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
    if (!SAFE_EXTENSIONS.has(ext)) {
      return cb(new Error('Invalid file extension'), '');
    }
    const name = crypto.randomBytes(16).toString('hex') + ext;
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
