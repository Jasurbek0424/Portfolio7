'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  FileCode,
  Mail,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/resume', label: 'CV / Resume', icon: FileCode },
  { href: '/admin/contact', label: 'Contact', icon: Mail },
  { href: '/admin/skills', label: 'Core Skills', icon: Code2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-6">
        <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
