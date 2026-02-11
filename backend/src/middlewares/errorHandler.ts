import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { config } from '../config';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    const multerErr = err as { code?: string; message?: string };
    const message =
      multerErr.code === 'LIMIT_FILE_SIZE'
        ? 'File too large (max 10 MB)'
        : multerErr.message || 'File upload error';
    res.status(400).json({ success: false, error: message });
    return;
  }
  if (err.message === 'Only PDF files are allowed') {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as { code?: string; meta?: { target?: string[] } };
    if (prismaErr.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: `Duplicate value for ${prismaErr.meta?.target?.join(', ') || 'unique field'}`,
      });
      return;
    }
    if (prismaErr.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Record not found',
      });
      return;
    }
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: config.isProd ? 'Internal server error' : err.message,
  });
}
