'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateContactInput } from '@/lib/api';

const CONTACT_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'other', label: 'Other' },
] as const;

const CONTACT_ICONS = [
  { value: 'mail', label: 'Mail' },
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'send', label: 'Send / Plane (Telegram)' },
  { value: 'link', label: 'Link' },
] as const;

const formSchema = z.object({
  type: z.enum(['email', 'github', 'linkedin', 'instagram', 'telegram', 'other']),
  icon: z.enum(['mail', 'github', 'linkedin', 'instagram', 'send', 'link']).optional().nullable(),
  label: z.string().max(100).optional(),
  value: z.string().min(1, 'Value is required'),
  sortOrder: z.coerce.number().int(),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  defaultValues?: Partial<CreateContactInput> & { sortOrder?: number };
  onSubmit: (data: CreateContactInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ContactForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: ContactFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'email',
      icon: null as string | null,
      label: '',
      value: '',
      sortOrder: 0,
      ...defaultValues,
    },
  });

  async function handleSubmit(data: FormData) {
    await onSubmit({
      type: data.type,
      icon: data.icon ?? null,
      label: data.label || null,
      value: data.value,
      sortOrder: data.sortOrder,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={form.watch('type')}
          onValueChange={(v) => form.setValue('type', v as FormData['type'])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Icon</Label>
        <Select
          value={form.watch('icon') ?? 'none'}
          onValueChange={(v) => form.setValue('icon', v === 'none' ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Auto (based on type)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Auto (based on type)</SelectItem>
            {CONTACT_ICONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="label">Label (optional)</Label>
        <Input
          id="label"
          placeholder="Display name"
          {...form.register('label')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">
          {form.watch('type') === 'email' ? 'Email' : 'URL'}
        </Label>
        <Input
          id="value"
          type={form.watch('type') === 'email' ? 'email' : 'url'}
          placeholder={
            form.watch('type') === 'email'
              ? 'email@example.com'
              : 'https://...'
          }
          {...form.register('value')}
          className={form.formState.errors.value ? 'border-destructive' : ''}
        />
        {form.formState.errors.value && (
          <p className="text-sm text-destructive">
            {form.formState.errors.value.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input
          id="sortOrder"
          type="number"
          {...form.register('sortOrder')}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
