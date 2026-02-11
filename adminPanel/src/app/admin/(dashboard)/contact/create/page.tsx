'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { contactApi, type CreateContactInput } from '@/lib/api';
import { ContactForm } from '@/components/admin/ContactForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateContactPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: CreateContactInput) {
    setIsLoading(true);
    try {
      await contactApi.create(data);
      toast.success('Contact added');
      router.push('/admin/contact');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/contact">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Contact</h1>
          <p className="text-muted-foreground">Yangi aloqa linki</p>
        </div>
      </div>

      <ContactForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Create" />
    </div>
  );
}
