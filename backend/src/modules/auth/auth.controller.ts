import type { Request, Response } from 'express';
import { loginSchema } from './auth.schema';
import { login } from './auth.service';

export async function loginController(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.parse(req.body);
  const result = await login(parsed);
  res.status(200).json({
    success: true,
    data: result,
  });
}
