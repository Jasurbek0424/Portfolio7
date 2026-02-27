import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

// Magic bytes for image validation
const MAGIC_BYTES: Record<string, Buffer[]> = {
  'image/jpeg': [Buffer.from([0xff, 0xd8, 0xff])],
  'image/png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  'image/gif': [Buffer.from('GIF87a'), Buffer.from('GIF89a')],
  'image/webp': [Buffer.from('RIFF')], // RIFF....WEBP
};

/** Validate file content matches its claimed MIME type */
export function validateMagicBytes(buffer: Buffer, mimetype: string): boolean {
  // SVG is text-based, check for XML/SVG markers and block dangerous content
  if (mimetype === 'image/svg+xml') {
    const content = buffer.toString('utf8').toLowerCase();
    if (!content.includes('<svg')) return false;
    const dangerous = ['<script', 'javascript:', 'onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'eval(', 'xlink:href'];
    if (dangerous.some((d) => content.includes(d))) return false;
    return true;
  }
  const signatures = MAGIC_BYTES[mimetype];
  if (!signatures) return false;
  return signatures.some((sig) => buffer.subarray(0, sig.length).equals(sig));
}

// Allowed extensions (prevent double-extension attacks like .php.jpg)
const SAFE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

/** Generate a safe filename from the original */
export function generateSafeFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  if (!SAFE_EXTENSIONS.has(ext)) {
    throw new Error('Invalid file extension');
  }
  return crypto.randomBytes(16).toString('hex') + ext;
}

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed'));
  }
};

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
