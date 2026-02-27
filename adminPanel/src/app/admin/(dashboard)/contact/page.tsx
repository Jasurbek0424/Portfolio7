'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, Mail, Github, Linkedin, Instagram, Send, Link2 } from 'lucide-react';
import { contactApi, type Contact } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const typeIcons: Record<string, React.ReactNode> = {
  mail: <Mail className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  send: <Send className="h-4 w-4" />,
  telegram: <Send className="h-4 w-4" />,
  link: <Link2 className="h-4 w-4" />,
  other: <Link2 className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
  email: 'Email',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  telegram: 'Telegram',
  other: 'Other',
};

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchContacts() {
    try {
      const res = await contactApi.getAll();
      setContacts(res.data.data);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await contactApi.delete(deleteId);
      toast.success('Contact deleted');
      setDeleteId(null);
      fetchContacts();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground">Manage contact links</p>
        </div>
        <Link href="/admin/contact/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>Add, edit, or delete</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No contacts yet. Add the first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Value / URL</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {typeIcons[c.icon ?? (c.type === 'telegram' ? 'send' : c.type)] ?? typeIcons.other}
                        <Badge variant="secondary">
                          {typeLabels[c.type] ?? c.type}
                        </Badge>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.label || '—'}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate font-mono text-sm">
                      {c.value}
                    </TableCell>
                    <TableCell>{c.sortOrder}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/contact/edit/${c.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
