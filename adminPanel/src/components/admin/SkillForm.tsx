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
import type { CreateSkillInput, SkillCategory } from '@/lib/api';

const formSchema = z.object({
  skillCategoryId: z.string().min(1, 'Select a category'),
  label: z.string().trim().min(1, 'Label is required').max(100),
  sortOrder: z.coerce.number().int(),
});

type FormData = z.infer<typeof formSchema>;

interface SkillFormProps {
  categories: SkillCategory[];
  defaultValues?: Partial<CreateSkillInput> & { sortOrder?: number };
  onSubmit: (data: CreateSkillInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function SkillForm({
  categories,
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: SkillFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillCategoryId: '',
      label: '',
      sortOrder: 0,
      ...defaultValues,
    },
  });

  async function handleSubmit(data: FormData) {
    await onSubmit({
      skillCategoryId: data.skillCategoryId,
      label: data.label,
      sortOrder: data.sortOrder,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={form.watch('skillCategoryId')}
          onValueChange={(v) => form.setValue('skillCategoryId', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.titleEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.skillCategoryId && (
          <p className="text-sm text-destructive">{form.formState.errors.skillCategoryId.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" {...form.register('label')} placeholder="React" />
        {form.formState.errors.label && (
          <p className="text-sm text-destructive">{form.formState.errors.label.message}</p>
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
