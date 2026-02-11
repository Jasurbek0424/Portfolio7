'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { CreateProjectInput } from '@/lib/api';

const projectSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Name is required'),
  titleRu: z.string().min(1, 'Name is required'),
  titleUz: z.string().min(1, 'Name is required'),
  descriptionEn: z.string().min(1, 'Description is required'),
  descriptionRu: z.string().min(1, 'Description is required'),
  descriptionUz: z.string().min(1, 'Description is required'),
  techStackInput: z.string(),
  thumbnail: z.string().optional().nullable(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean(),
  sortOrder: z.number(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: Partial<CreateProjectInput> & { published?: boolean; sortOrder?: number };
  onSubmit: (data: CreateProjectInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

function parseTechStack(str: string): string[] {
  return str
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues
      ? {
          slug: defaultValues.slug ?? '',
          titleEn: defaultValues.titleEn ?? '',
          titleRu: defaultValues.titleRu ?? '',
          titleUz: defaultValues.titleUz ?? '',
          descriptionEn: defaultValues.descriptionEn ?? '',
          descriptionRu: defaultValues.descriptionRu ?? '',
          descriptionUz: defaultValues.descriptionUz ?? '',
          techStackInput: (defaultValues.techStack ?? []).join(', '),
          thumbnail: defaultValues.thumbnail ?? '',
          githubUrl: defaultValues.githubUrl ?? '',
          linkUrl: defaultValues.linkUrl ?? '',
          published: defaultValues.published ?? false,
          sortOrder: defaultValues.sortOrder ?? 0,
        }
      : {
          slug: '',
          titleEn: '',
          titleRu: '',
          titleUz: '',
          descriptionEn: '',
          descriptionRu: '',
          descriptionUz: '',
          techStackInput: '',
          thumbnail: '',
          githubUrl: '',
          linkUrl: '',
          published: true,
          sortOrder: 0,
        },
  });

  async function handleSubmit(data: ProjectFormData) {
    await onSubmit({
      slug: data.slug,
      titleEn: data.titleEn,
      titleRu: data.titleRu,
      titleUz: data.titleUz,
      descriptionEn: data.descriptionEn,
      descriptionRu: data.descriptionRu,
      descriptionUz: data.descriptionUz,
      techStack: parseTechStack(data.techStackInput),
      thumbnail: data.thumbnail || null,
      githubUrl: data.githubUrl || null,
      linkUrl: data.linkUrl || null,
      published: data.published,
      sortOrder: data.sortOrder,
    });
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="my-project"
              {...form.register('slug')}
              className={form.formState.errors.slug ? 'border-destructive' : ''}
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack (vergul yoki bo'shliq bilan ajrating)</Label>
            <Input
              id="techStack"
              type="text"
              placeholder="React, TypeScript, Node.js"
              {...form.register('techStackInput')}
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              value={form.watch('thumbnail')}
              onChange={(url) => form.setValue('thumbnail', url || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub Link</Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/..."
              {...form.register('githubUrl')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkUrl">Live Demo Link</Label>
            <Input
              id="linkUrl"
              type="url"
              placeholder="https://..."
              {...form.register('linkUrl')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              {...form.register('sortOrder', { valueAsNumber: true })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={form.watch('published')}
              onCheckedChange={(v) => form.setValue('published', v)}
            />
            <Label htmlFor="published">Featured / Published</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content (Multilingual)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
              <TabsTrigger value="uz">Uzbek</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name (EN)</Label>
                <Input {...form.register('titleEn')} className={form.formState.errors.titleEn ? 'border-destructive' : ''} />
                {form.formState.errors.titleEn && <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Description (EN)</Label>
                <Textarea {...form.register('descriptionEn')} rows={4} className={form.formState.errors.descriptionEn ? 'border-destructive' : ''} />
                {form.formState.errors.descriptionEn && <p className="text-sm text-destructive">{form.formState.errors.descriptionEn.message}</p>}
              </div>
            </TabsContent>
            <TabsContent value="ru" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name (RU)</Label>
                <Input {...form.register('titleRu')} className={form.formState.errors.titleRu ? 'border-destructive' : ''} />
                {form.formState.errors.titleRu && <p className="text-sm text-destructive">{form.formState.errors.titleRu.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Description (RU)</Label>
                <Textarea {...form.register('descriptionRu')} rows={4} className={form.formState.errors.descriptionRu ? 'border-destructive' : ''} />
                {form.formState.errors.descriptionRu && <p className="text-sm text-destructive">{form.formState.errors.descriptionRu.message}</p>}
              </div>
            </TabsContent>
            <TabsContent value="uz" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Name (UZ)</Label>
                <Input {...form.register('titleUz')} className={form.formState.errors.titleUz ? 'border-destructive' : ''} />
                {form.formState.errors.titleUz && <p className="text-sm text-destructive">{form.formState.errors.titleUz.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Description (UZ)</Label>
                <Textarea {...form.register('descriptionUz')} rows={4} className={form.formState.errors.descriptionUz ? 'border-destructive' : ''} />
                {form.formState.errors.descriptionUz && <p className="text-sm text-destructive">{form.formState.errors.descriptionUz.message}</p>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
