'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { resumeApi, type ResumeSection } from '@/lib/api';
import { ResumeSectionForm } from '@/components/admin/ResumeSectionForm';
import { CvFileUpload } from '@/components/admin/CvFileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const RESUME_SECTIONS = [
  { key: 'about', label: 'About Me' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
] as const;

export default function ResumePage() {
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSections() {
    try {
      const res = await resumeApi.getAll();
      setSections(res.data.data);
    } catch {
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSections();
  }, []);

  function getSectionByKey(key: string): (ResumeSection & { sectionKey?: string }) | undefined {
    return sections.find((s) => (s as ResumeSection & { sectionKey?: string }).sectionKey === key);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">CV / Resume</h1>
        <p className="text-muted-foreground">Manage CV file and resume sections</p>
      </div>

      <CvFileUpload />

      <div className="space-y-6">
        {RESUME_SECTIONS.map(({ key, label }) => {
          const section = getSectionByKey(key);
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>
                  {section ? 'Edit this section' : 'Create this section'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeSectionForm
                  sectionKey={key}
                  section={section}
                  onSuccess={fetchSections}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
