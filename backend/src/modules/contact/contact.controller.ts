import type { Request, Response } from 'express';
import { createContactSchema, updateContactSchema, sendMessageSchema } from './contact.schema';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  sendMessageToTelegram,
} from './contact.service';

export async function getContactsController(_req: Request, res: Response): Promise<void> {
  const contacts = await getAllContacts();
  res.json({
    success: true,
    data: contacts.map((c) => ({
      id: c.id,
      type: c.type,
      icon: c.icon,
      label: c.label,
      value: c.value,
      sortOrder: c.sortOrder,
    })),
  });
}

export async function getContactByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const contact = await getContactById(id!);
  res.json({ success: true, data: contact });
}

export async function createContactController(req: Request, res: Response): Promise<void> {
  const parsed = createContactSchema.parse(req.body);
  const contact = await createContact(parsed);
  res.status(201).json({ success: true, data: contact });
}

export async function updateContactController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const parsed = updateContactSchema.parse(req.body);
  const contact = await updateContact(id!, parsed);
  res.json({ success: true, data: contact });
}

export async function deleteContactController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await deleteContact(id!);
  res.status(204).send();
}

export async function sendMessageController(req: Request, res: Response): Promise<void> {
  const parsed = sendMessageSchema.parse(req.body);
  const result = await sendMessageToTelegram(parsed);
  if (!result.ok) {
    console.error('[Contact] Telegram message failed:', result.error);
    res.status(502).json({ success: false, error: 'Failed to send message' });
    return;
  }
  res.json({ success: true, message: 'Message sent' });
}
