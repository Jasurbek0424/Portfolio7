'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateSkillCategoryInput } from '@/lib/api';

const formSchema = z.object({
  titleEn: z.string().min(1, 'Title (EN) is required'),
  titleRu: z.string().min(1, 'Title (RU) is required'),
  titleUz: z.string().min(1, 'Title (UZ) is required'),
  sortOrder: z.coerce.number().int(),
});

type FormData = z.infer<typeof formSchema>;

interface SkillCategoryFormProps {
  defaultValues?: Partial<CreateSkillCategoryInput> & { sortOrder?: number };
  onSubmit: (data: CreateSkillCategoryInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function SkillCategoryForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: SkillCategoryFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleEn: '',
      titleRu: '',
      titleUz: '',
      sortOrder: 0,
      ...defaultValues,
    },
  });

  async function handleSubmit(data: FormData) {
    await onSubmit({
      titleEn: data.titleEn,
      titleRu: data.titleRu,
      titleUz: data.titleUz,
      sortOrder: data.sortOrder,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titleEn">Title (EN)</Label>
        <Input id="titleEn" {...form.register('titleEn')} placeholder="Frontend" />
        {form.formState.errors.titleEn && (
          <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="titleRu">Title (RU)</Label>
        <Input id="titleRu" {...form.register('titleRu')} placeholder="Фронтенд" />
        {form.formState.errors.titleRu && (
          <p className="text-sm text-destructive">{form.formState.errors.titleRu.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="titleUz">Title (UZ)</Label>
        <Input id="titleUz" {...form.register('titleUz')} placeholder="Frontend" />
        {form.formState.errors.titleUz && (
          <p className="text-sm text-destructive">{form.formState.errors.titleUz.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Input id="sortOrder" type="number" {...form.register('sortOrder')} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
