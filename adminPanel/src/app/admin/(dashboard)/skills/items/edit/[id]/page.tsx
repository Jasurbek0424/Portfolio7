'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { skillCategoriesApi, skillsApi, type CreateSkillInput, type UpdateSkillInput } from '@/lib/api';
import { SkillForm } from '@/components/admin/SkillForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditSkillItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof skillCategoriesApi.getAll>>['data']['data']>([]);
  const [initialData, setInitialData] = useState<(CreateSkillInput & { sortOrder?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([skillCategoriesApi.getAll(), skillsApi.getById(id)])
      .then(([catRes, skillRes]) => {
        setCategories(catRes.data.data);
        const d = skillRes.data.data;
        setInitialData({
          skillCategoryId: d.skillCategoryId,
          label: d.label,
          sortOrder: d.sortOrder,
        });
      })
      .catch(() => {
        toast.error('Failed to load data');
        router.push('/admin/skills');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleSubmit(data: CreateSkillInput) {
    setSaving(true);
    try {
      const payload: UpdateSkillInput = data;
      await skillsApi.update(id, payload);
      toast.success('Skill updated');
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

  if (loading || !initialData) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/skills">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Skill</h1>
          <p className="text-muted-foreground">{initialData.label}</p>
        </div>
      </div>

      <SkillForm
        categories={categories}
        defaultValues={initialData}
        onSubmit={handleSubmit}
        isLoading={saving}
        submitLabel="Save"
      />
    </div>
  );
}
