'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { resumeApi, type ResumeSection } from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { toast } from 'sonner';

const schema = z.object({
  titleEn: z.string().min(1, 'Title is required'),
  titleRu: z.string().min(1, 'Title is required'),
  titleUz: z.string().min(1, 'Title is required'),
  contentEn: z.string().min(1, 'Content is required'),
  contentRu: z.string().min(1, 'Content is required'),
  contentUz: z.string().min(1, 'Content is required'),
});

type FormData = z.infer<typeof schema>;

interface ResumeSectionFormProps {
  sectionKey: string;
  section?: ResumeSection & { sectionKey?: string };
  onSuccess: () => void;
}

export function ResumeSectionForm({ sectionKey, section, onSuccess }: ResumeSectionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fullSection, setFullSection] = useState<ResumeSection | null>(null);
  const isEdit = !!section?.id;

  useEffect(() => {
    if (section?.id) {
      resumeApi.getById(section.id).then((res) => setFullSection(res.data.data));
    } else {
      setFullSection(null);
    }
  }, [section?.id]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      titleEn: '',
      titleRu: '',
      titleUz: '',
      contentEn: '',
      contentRu: '',
      contentUz: '',
    },
  });

  useEffect(() => {
    if (fullSection) {
      form.reset({
        titleEn: fullSection.titleEn,
        titleRu: fullSection.titleRu,
        titleUz: fullSection.titleUz,
        contentEn: fullSection.contentEn,
        contentRu: fullSection.contentRu,
        contentUz: fullSection.contentUz,
      });
    }
  }, [fullSection, form]);

  async function handleSubmit(data: FormData) {
    setIsLoading(true);
    try {
      if (isEdit && section?.id) {
        await resumeApi.update(section.id, data);
        toast.success('Section updated');
      } else {
        await resumeApi.create({
          sectionKey,
          ...data,
          sortOrder: 0,
        });
        toast.success('Section created');
      }
      onSuccess();
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Failed to save'));
    } finally {
      setIsLoading(false);
    }
  }

  if (isEdit && !fullSection) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ru">Russian</TabsTrigger>
          <TabsTrigger value="uz">Uzbek</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Section Title (EN)</Label>
            <Input {...form.register('titleEn')} className={form.formState.errors.titleEn ? 'border-destructive' : ''} />
            {form.formState.errors.titleEn && <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Content (EN) - Markdown supported</Label>
            <Textarea {...form.register('contentEn')} rows={6} className="font-mono text-sm" />
            {form.formState.errors.contentEn && <p className="text-sm text-destructive">{form.formState.errors.contentEn.message}</p>}
          </div>
        </TabsContent>
        <TabsContent value="ru" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Section Title (RU)</Label>
            <Input {...form.register('titleRu')} className={form.formState.errors.titleRu ? 'border-destructive' : ''} />
            {form.formState.errors.titleRu && <p className="text-sm text-destructive">{form.formState.errors.titleRu.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Content (RU)</Label>
            <Textarea {...form.register('contentRu')} rows={6} className="font-mono text-sm" />
            {form.formState.errors.contentRu && <p className="text-sm text-destructive">{form.formState.errors.contentRu.message}</p>}
          </div>
        </TabsContent>
        <TabsContent value="uz" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Section Title (UZ)</Label>
            <Input {...form.register('titleUz')} className={form.formState.errors.titleUz ? 'border-destructive' : ''} />
            {form.formState.errors.titleUz && <p className="text-sm text-destructive">{form.formState.errors.titleUz.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Content (UZ)</Label>
            <Textarea {...form.register('contentUz')} rows={6} className="font-mono text-sm" />
            {form.formState.errors.contentUz && <p className="text-sm text-destructive">{form.formState.errors.contentUz.message}</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
