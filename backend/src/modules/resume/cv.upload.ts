import multer from 'multer';
import { getUploadsDir } from './cv.service';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = getUploadsDir();
    cb(null, dir);
  },
  filename: (_req, _file, cb) => {
    cb(null, 'cv.pdf');
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

export const uploadCv = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});