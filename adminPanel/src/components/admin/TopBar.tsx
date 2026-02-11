'use client';

import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{user.email}</span>
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">{user.email}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
