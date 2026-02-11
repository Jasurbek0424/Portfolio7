'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { skillCategoriesApi, skillsApi, type SkillCategory, type Skill } from '@/lib/api';
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
import { toast } from 'sonner';

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteSkillId, setDeleteSkillId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchData() {
    try {
      const [catRes, skillRes] = await Promise.all([
        skillCategoriesApi.getAll(),
        skillsApi.getAll(),
      ]);
      setCategories(catRes.data.data);
      setSkills(skillRes.data.data);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDeleteCategory() {
    if (!deleteCategoryId) return;
    setDeleting(true);
    try {
      await skillCategoriesApi.delete(deleteCategoryId);
      toast.success('Category deleted');
      setDeleteCategoryId(null);
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  async function handleDeleteSkill() {
    if (!deleteSkillId) return;
    setDeleting(true);
    try {
      await skillsApi.delete(deleteSkillId);
      toast.success('Skill deleted');
      setDeleteSkillId(null);
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Core Skills</h1>
        <p className="text-muted-foreground">Manage skill categories and items</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Frontend, UI Libraries, Tools, Practices</CardDescription>
            </div>
            <Link href="/admin/skills/categories/create">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No categories found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title (EN)</TableHead>
                  <TableHead>Title (RU)</TableHead>
                  <TableHead>Title (UZ)</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.titleEn}</TableCell>
                    <TableCell>{c.titleRu}</TableCell>
                    <TableCell>{c.titleUz}</TableCell>
                    <TableCell>{c.sortOrder}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/skills/categories/edit/${c.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteCategoryId(c.id)}
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skilllar</CardTitle>
              <CardDescription>Skills list for each category</CardDescription>
            </div>
            <Link href="/admin/skills/items/create">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : skills.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Skill yo‘q.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-muted-foreground">
                      {s.skillCategory ? s.skillCategory.titleEn : s.skillCategoryId}
                    </TableCell>
                    <TableCell>{s.label}</TableCell>
                    <TableCell>{s.sortOrder}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/skills/items/edit/${s.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteSkillId(s.id)}
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

      <Dialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              This category and all its skills will be deleted. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCategoryId(null)}>
              Bekor
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteSkillId} onOpenChange={() => setDeleteSkillId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>Are you sure you want to delete this skill?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteSkillId(null)}>
              Bekor
            </Button>
            <Button variant="destructive" onClick={handleDeleteSkill} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
