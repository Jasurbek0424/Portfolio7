import { config } from '../../config';
import { prisma } from '../../utils/prisma';
import { NotFoundError } from '../../utils/errors';
import type { CreateContactInput, UpdateContactInput, SendMessageInput } from './contact.schema';

const TELEGRAM_API = 'https://api.telegram.org';
const TELEGRAM_TIMEOUT_MS = 6000;

export async function sendMessageToTelegram(input: SendMessageInput): Promise<{ ok: boolean; error?: string }> {
  const token = config.TELEGRAM_BOT_TOKEN;
  const chatId = config.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: 'Telegram bot not configured (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)' };
  }
  const text = [
    '📩 <b>Portfolio: New message</b>',
    '',
    `<b>Name:</b> ${escapeHtml(input.name)}`,
    `<b>Email:</b> ${escapeHtml(input.email)}`,
    '',
    '<b>Message:</b>',
    escapeHtml(input.message),
  ].join('\n');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = (await res.json()) as { ok?: boolean; description?: string };
    if (!data.ok) {
      return { ok: false, error: data.description || 'Telegram API error' };
    }
    return { ok: true };
  } catch (e) {
    clearTimeout(timeoutId);
    const message = e instanceof Error ? e.message : String(e);
    const isTimeout = e instanceof Error && e.name === 'AbortError';
    return { ok: false, error: isTimeout ? 'Telegram timeout' : message };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function getAllContacts() {
  return prisma.contact.findMany({
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getContactById(id: string) {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });
  if (!contact) throw new NotFoundError('Contact');
  return contact;
}

export async function createContact(input: CreateContactInput) {
  return prisma.contact.create({
    data: {
      type: input.type,
      icon: input.icon ?? null,
      label: input.label ?? null,
      value: input.value,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function updateContact(id: string, input: UpdateContactInput) {
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) throw new NotFoundError('Contact');
  return prisma.contact.update({
    where: { id },
    data: {
      ...(input.type !== undefined && { type: input.type }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.label !== undefined && { label: input.label }),
      ...(input.value !== undefined && { value: input.value }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  });
}

export async function deleteContact(id: string) {
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) throw new NotFoundError('Contact');
  return prisma.contact.delete({
    where: { id },
  });
}
