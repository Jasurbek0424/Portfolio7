'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { skillCategoriesApi, type CreateSkillCategoryInput, type UpdateSkillCategoryInput } from '@/lib/api';
import { SkillCategoryForm } from '@/components/admin/SkillCategoryForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditSkillCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<(CreateSkillCategoryInput & { sortOrder?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    skillCategoriesApi
      .getById(id)
      .then((res) => {
        const d = res.data.data;
        setInitialData({
          titleEn: d.titleEn,
          titleRu: d.titleRu,
          titleUz: d.titleUz,
          sortOrder: d.sortOrder,
        });
      })
      .catch(() => {
        toast.error('Category not found');
        router.push('/admin/skills');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleSubmit(data: CreateSkillCategoryInput) {
    setSaving(true);
    try {
      const payload: UpdateSkillCategoryInput = data;
      await skillCategoriesApi.update(id, payload);
      toast.success('Category updated');
      router.push('/admin/skills');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Update failed';
      toast.error(msg || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/skills">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">Core Skills category</p>
        </div>
      </div>

      <SkillCategoryForm
        defaultValues={initialData}
        onSubmit={handleSubmit}
        isLoading={saving}
        submitLabel="Save"
      />
    </div>
  );
}
