'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { projectsApi, type CreateProjectInput } from '@/lib/api';
import { getApiError } from '@/lib/utils';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateProjectInput) {
    setIsLoading(true);
    try {
      await projectsApi.create(data);
      toast.success('Project created');
      router.push('/admin/projects');
    } catch (err: unknown) {
      toast.error(getApiError(err, 'Failed to create project'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Project</h1>
          <p className="text-muted-foreground">Create a new project</p>
        </div>
      </div>

      <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create Project" />
    </div>
  );
}
