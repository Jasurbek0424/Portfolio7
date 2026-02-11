import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../utils/prisma';
import { config } from '../../config';
import { UnauthorizedError } from '../../utils/errors';
import type { LoginInput } from './auth.schema';
import type { JwtPayload } from '../../middlewares/auth';

export async function login(input: LoginInput): Promise<{ token: string; user: { id: string; email: string; role: string } }> {
  const user = await prisma.adminUser.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(
    payload,
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
