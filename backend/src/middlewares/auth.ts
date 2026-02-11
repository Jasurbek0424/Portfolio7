import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError } from '../utils/errors';
import { prisma } from '../utils/prisma';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export async function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.role !== 'admin') {
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
      return;
    }
    next(err);
  }
}
