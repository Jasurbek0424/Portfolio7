import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

// In production, require explicit JWT_SECRET (min 32 chars)
const jwtSecret = process.env.JWT_SECRET || (isProd ? '' : `dev-${crypto.randomBytes(32).toString('hex')}`);

if (isProd && (!jwtSecret || jwtSecret.length < 32)) {
  console.error('FATAL: JWT_SECRET must be set (min 32 chars) in production');
  process.exit(1);
}

if (isProd && !process.env.DATABASE_URL) {
  console.error('FATAL: DATABASE_URL must be set in production');
  process.exit(1);
}

if (isProd && !process.env.ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD must be set in production');
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
} as const;

export const config = {
  ...env,
  isDev: !isProd,
  isProd,
} as const;

export type SupportedLang = 'en' | 'ru' | 'uz';
