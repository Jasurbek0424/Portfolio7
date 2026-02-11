import path from 'path';
import fs from 'fs';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const CV_FILENAME = 'cv.pdf';

export function getUploadsDir(): string {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

export function getCvFilePath(): string {
  return path.join(getUploadsDir(), CV_FILENAME);
}

export async function getCvFile() {
  const cv = await prisma.cvFile.findUnique({
    where: { key: 'default' },
  });
  if (!cv) return null;
  const fullPath = path.join(process.cwd(), cv.filePath);
  if (!fs.existsSync(fullPath)) return null;
  return cv;
}

export async function getCvFileOrThrow() {
  const cv = await getCvFile();
  if (!cv) throw new NotFoundError('CV file');
  return cv;
}

export async function saveCvFile(
  filePath: string,
  originalName: string,
  mimeType: string
) {
  return prisma.cvFile.upsert({
    where: { key: 'default' },
    create: {
      key: 'default',
      filePath,
      fileName: originalName,
      mimeType,
    },
    update: {
      filePath,
      fileName: originalName,
      mimeType,
    },
  });
}
