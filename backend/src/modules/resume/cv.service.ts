import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';

export async function getCvFile() {
  return prisma.cvFile.findUnique({
    where: { key: 'default' },
  });
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
