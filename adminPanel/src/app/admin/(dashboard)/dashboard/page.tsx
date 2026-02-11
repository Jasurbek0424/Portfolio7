import { FileText, FolderKanban, FileCode } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { href: '/admin/blogs', label: 'Manage Blogs', icon: FileText },
  { href: '/admin/projects', label: 'Manage Projects', icon: FolderKanban },
  { href: '/admin/resume', label: 'Edit Resume', icon: FileCode },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your portfolio admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{link.label}</CardTitle>
                <link.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Button variant="secondary" size="sm">
                  Go to {link.label.split(' ')[1]}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Overview of your content</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to navigate to Blogs, Projects, or CV/Resume management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
