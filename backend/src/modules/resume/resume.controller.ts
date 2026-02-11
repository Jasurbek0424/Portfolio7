import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createResumeSectionSchema, updateResumeSectionSchema } from './resume.schema';
import type { LangRequest } from '../../middlewares/lang';
import {
  getResumeSections,
  getResumeSectionByKey,
  getResumeSectionById,
  createResumeSection,
  updateResumeSection,
  deleteResumeSection,
} from './resume.service';
import { getCvFile, getCvFileOrThrow, saveCvFile } from './cv.service';

export async function getResumeController(req: LangRequest, res: Response): Promise<void> {
  const lang = req.lang ?? 'en';
  const sections = await getResumeSections(lang);
  res.json({ success: true, data: sections });
}

export async function getResumeSectionByKeyController(req: LangRequest, res: Response): Promise<void> {
  const { sectionKey } = req.params;
  const lang = req.lang ?? 'en';
  const section = await getResumeSectionByKey(sectionKey!, lang);
  res.json({ success: true, data: section });
}

export async function getResumeSectionByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const section = await getResumeSectionById(id!);
  res.json({ success: true, data: section });
}

export async function createResumeSectionController(req: Request, res: Response): Promise<void> {
  const parsed = createResumeSectionSchema.parse(req.body);
  const section = await createResumeSection(parsed);
  res.status(201).json({ success: true, data: section });
}

export async function updateResumeSectionController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const parsed = updateResumeSectionSchema.parse(req.body);
  const section = await updateResumeSection(id!, parsed);
  res.json({ success: true, data: section });
}

export async function deleteResumeSectionController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await deleteResumeSection(id!);
  res.status(204).send();
}

// ===== CV File (public) =====
export async function getCvInfoController(_req: Request, res: Response): Promise<void> {
  const cv = await getCvFile();
  if (!cv) {
    res.status(404).json({ success: false, error: 'CV file not found' });
    return;
  }
  const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
  res.json({
    success: true,
    data: {
      url: `${baseUrl}/api/resume/cv/download`,
      fileName: cv.fileName,
    },
  });
}

export async function downloadCvController(_req: Request, res: Response): Promise<void> {
  const cv = await getCvFileOrThrow();
  const fullPath = path.join(process.cwd(), cv.filePath);
  if (!fs.existsSync(fullPath)) {
    res.status(404).json({ success: false, error: 'CV file not found' });
    return;
  }
  res.setHeader('Content-Type', cv.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${cv.fileName}"`);
  res.sendFile(fullPath);
}

// ===== CV File info (admin) =====
export async function getCvInfoAdminController(_req: Request, res: Response): Promise<void> {
  const cv = await getCvFile();
  if (!cv) {
    res.status(404).json({ success: false, error: 'CV file not found' });
    return;
  }
  res.json({ success: true, data: { fileName: cv.fileName } });
}

// ===== CV File upload (admin) =====
export async function uploadCvController(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: 'No file uploaded' });
    return;
  }
  const relativePath = path.relative(process.cwd(), file.path);
  const saved = await saveCvFile(relativePath, file.originalname || 'cv.pdf', file.mimetype);
  res.json({ success: true, data: { fileName: saved.fileName, url: '/api/resume/cv/download' } });
}
