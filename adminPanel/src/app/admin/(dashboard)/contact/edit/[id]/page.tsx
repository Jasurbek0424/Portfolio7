'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { contactApi, type CreateContactInput, type UpdateContactInput } from '@/lib/api';
import { ContactForm } from '@/components/admin/ContactForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<CreateContactInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contactApi
      .getById(id)
      .then((res) => {
        const d = res.data.data;
        setInitialData({
          type: d.type as CreateContactInput['type'],
          icon: d.icon ?? undefined,
          label: d.label ?? undefined,
          value: d.value,
          sortOrder: d.sortOrder,
        });
      })
      .catch(() => {
        toast.error('Contact not found');
        router.push('/admin/contact');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleSubmit(data: CreateContactInput) {
    setSaving(true);
    try {
      const payload: UpdateContactInput = data;
      await contactApi.update(id, payload);
      toast.success('Contact updated');
      router.push('/admin/contact');
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
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/contact">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Contact</h1>
          <p className="text-muted-foreground">Aloqa ma’lumotini o‘zgartirish</p>
        </div>
      </div>

      <ContactForm
        defaultValues={initialData}
        onSubmit={handleSubmit}
        isLoading={saving}
        submitLabel="Save"
      />
    </div>
  );
}
