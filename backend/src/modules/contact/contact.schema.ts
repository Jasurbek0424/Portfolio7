import { z } from 'zod';

const contactTypes = ['email', 'github', 'linkedin', 'instagram', 'telegram', 'other'] as const;
const contactIcons = ['mail', 'github', 'linkedin', 'instagram', 'send', 'link'] as const;

export const createContactSchema = z.object({
  type: z.enum(contactTypes),
  icon: z.enum(contactIcons).optional().nullable(),
  label: z.string().max(100).optional().nullable(),
  value: z.string().min(1, 'Value is required'),
  sortOrder: z.number().int().default(0),
});

export const updateContactSchema = z.object({
  type: z.enum(contactTypes).optional(),
  icon: z.enum(contactIcons).optional().nullable(),
  label: z.string().max(100).optional().nullable(),
  value: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
});

export const sendMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
