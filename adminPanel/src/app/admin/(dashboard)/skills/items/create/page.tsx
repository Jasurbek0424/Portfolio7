'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { skillCategoriesApi, skillsApi, type CreateSkillInput } from '@/lib/api';
import { SkillForm } from '@/components/admin/SkillForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateSkillItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Awaited<ReturnType<typeof skillCategoriesApi.getAll>>['data']['data']>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    skillCategoriesApi
      .getAll()
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(data: CreateSkillInput) {
    setIsLoading(true);
    try {
      await skillsApi.create(data);
      toast.success('Skill added');
      router.push('/admin/skills');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Failed to create';
      toast.error(msg || 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
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
          <h1 className="text-2xl font-bold tracking-tight">Add Skill</h1>
          <p className="text-muted-foreground">Add a new skill to a category</p>
        </div>
      </div>

      <SkillForm
        categories={categories}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Create"
      />
    </div>
  );
}
