import type { Request, Response, NextFunction } from 'express';
import { parseLang } from '../utils/language';

export interface LangRequest extends Request {
  lang?: 'en' | 'ru' | 'uz';
}

export function langMiddleware(
  req: LangRequest,
  _res: Response,
  next: NextFunction
): void {
  const lang = req.query.lang as string | undefined;
  req.lang = parseLang(lang);
  next();
}
