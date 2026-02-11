'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { projectsApi, type CreateProjectInput, type UpdateProjectInput } from '@/lib/api';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<CreateProjectInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await projectsApi.getById(id);
        setInitialData(res.data.data);
      } catch {
        toast.error('Project not found');
        router.push('/admin/projects');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetch();
  }, [id, router]);

  async function handleSubmit(data: CreateProjectInput) {
    setIsSubmitting(true);
    try {
      const payload: UpdateProjectInput = { ...data };
      await projectsApi.update(id, payload);
      toast.success('Project updated');
      router.push('/admin/projects');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : 'Failed to update project';
      toast.error(msg || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">Update project details</p>
        </div>
      </div>

      <ProjectForm
        defaultValues={initialData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Update Project"
      />
    </div>
  );
}
