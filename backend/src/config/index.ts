import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
} as const;

export const config = {
  ...env,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
} as const;

export type SupportedLang = 'en' | 'ru' | 'uz';
