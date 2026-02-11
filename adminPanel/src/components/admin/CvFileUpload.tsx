'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { resumeApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function CvFileUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchCvInfo() {
    try {
      const res = await resumeApi.getCvInfo();
      setFileName(res.data.data.fileName);
    } catch {
      setFileName(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCvInfo();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    setUploading(true);
    try {
      await resumeApi.uploadCv(file);
      setFileName(file.name);
      toast.success('CV uploaded successfully');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Upload failed';
      toast.error(msg || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> CV File (PDF)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> CV File (PDF)
        </CardTitle>
        <CardDescription>
          The &quot;Download CV&quot; button on the portfolio site will serve this file. Only PDF accepted (max 10 MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
        {fileName && (
          <p className="text-sm text-muted-foreground">
            Current file: <span className="font-medium text-foreground">{fileName}</span>
          </p>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : fileName ? 'Replace file' : 'Upload PDF'}
        </Button>
      </CardContent>
    </Card>
  );
}
