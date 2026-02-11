'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fullUrl = value
    ? value.startsWith('http') ? value : `${API_BASE}${value}`
    : null;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      onChange(res.data.data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {fullUrl ? (
        <div className="relative">
          <img
            src={fullUrl}
            alt="Thumbnail"
            className="h-40 w-full rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-destructive transition-colors hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload image</span>
            </>
          )}
        </div>
      )}

      {fullUrl && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="mr-2 h-3.5 w-3.5" />
          )}
          Replace image
        </Button>
      )}
    </div>
  );
}
