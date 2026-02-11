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
import type { CreateBlogInput } from '@/lib/api';

const blogSchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  titleEn: z.string().min(1, 'Title is required'),
  titleRu: z.string().min(1, 'Title is required'),
  titleUz: z.string().min(1, 'Title is required'),
  descriptionEn: z.string().min(1, 'Excerpt is required'),
  descriptionRu: z.string().min(1, 'Excerpt is required'),
  descriptionUz: z.string().min(1, 'Excerpt is required'),
  contentEn: z.string().min(1, 'Content is required'),
  contentRu: z.string().min(1, 'Content is required'),
  contentUz: z.string().min(1, 'Content is required'),
  thumbnail: z.string().optional().nullable(),
  published: z.boolean(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  defaultValues?: Partial<CreateBlogInput> & { published?: boolean };
  onSubmit: (data: CreateBlogInput) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function BlogForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: BlogFormProps) {
  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      slug: '',
      titleEn: '',
      titleRu: '',
      titleUz: '',
      descriptionEn: '',
      descriptionRu: '',
      descriptionUz: '',
      contentEn: '',
      contentRu: '',
      contentUz: '',
      thumbnail: '',
      published: true,
      ...defaultValues,
    },
  });

  async function handleSubmit(data: BlogFormData) {
    await onSubmit({
      slug: data.slug,
      titleEn: data.titleEn,
      titleRu: data.titleRu,
      titleUz: data.titleUz,
      descriptionEn: data.descriptionEn,
      descriptionRu: data.descriptionRu,
      descriptionUz: data.descriptionUz,
      contentEn: data.contentEn,
      contentRu: data.contentRu,
      contentUz: data.contentUz,
      thumbnail: data.thumbnail || null,
      published: data.published,
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
              placeholder="my-blog-post"
              {...form.register('slug')}
              className={form.formState.errors.slug ? 'border-destructive' : ''}
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              value={form.watch('thumbnail')}
              onChange={(url) => form.setValue('thumbnail', url || null)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={form.watch('published')}
              onCheckedChange={(v) => form.setValue('published', v)}
            />
            <Label htmlFor="published">Published</Label>
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
                <Label>Title (EN)</Label>
                <Input {...form.register('titleEn')} className={form.formState.errors.titleEn ? 'border-destructive' : ''} />
                {form.formState.errors.titleEn && <p className="text-sm text-destructive">{form.formState.errors.titleEn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Short excerpt (EN)</Label>
                <Textarea {...form.register('descriptionEn')} rows={2} className={form.formState.errors.descriptionEn ? 'border-destructive' : ''} />
                {form.formState.errors.descriptionEn && <p className="text-sm text-destructive">{form.formState.errors.descriptionEn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Content - Markdown (EN)</Label>
                <Textarea {...form.register('contentEn')} rows={12} className="font-mono text-sm" />
                {form.formState.errors.contentEn && <p className="text-sm text-destructive">{form.formState.errors.contentEn.message}</p>}
              </div>
            </TabsContent>
            <TabsContent value="ru" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title (RU)</Label>
                <Input {...form.register('titleRu')} className={form.formState.errors.titleRu ? 'border-destructive' : ''} />
                {form.formState.errors.titleRu && <p className="text-sm text-destructive">{form.formState.errors.titleRu.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Short excerpt (RU)</Label>
                <Textarea {...form.register('descriptionRu')} rows={2} className={form.formState.errors.descriptionRu ? 'border-destructive' : ''} />
                {form.formState.errors.descriptionRu && <p className="text-sm text-destructive">{form.formState.errors.descriptionRu.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Content - Markdown (RU)</Label>
                <Textarea {...form.register('contentRu')} rows={12} className="font-mono text-sm" />
                {form.formState.errors.contentRu && <p className="text-sm text-destructive">{form.formState.errors.contentRu.message}</p>}
              </div>
            </TabsContent>
            <TabsContent value="uz" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title (UZ)</Label>
                <Input {...form.register('titleUz')} className={form.formState.errors.titleUz ? 'border-destructive' : ''} />
                {form.formState.errors.titleUz && <p className="text-sm text-destructive">{form.formState.errors.titleUz.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Short excerpt (UZ)</Label>
                <Textarea {...form.register('descriptionUz')} rows={2} className={form.formState.errors.descriptionUz ? 'border-destructive' : ''} />
                {form.formState.errors.descriptionUz && <p className="text-sm text-destructive">{form.formState.errors.descriptionUz.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Content - Markdown (UZ)</Label>
                <Textarea {...form.register('contentUz')} rows={12} className="font-mono text-sm" />
                {form.formState.errors.contentUz && <p className="text-sm text-destructive">{form.formState.errors.contentUz.message}</p>}
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
