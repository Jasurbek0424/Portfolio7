'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthToken } from '@/lib/api';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const initAuth = useCallback(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const parsed = JSON.parse(userStr) as AdminUser;
        setAuthToken(token);
        setUser(parsed);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setAuthToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
      setAuthToken(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback((token: string, userData: AdminUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  const requireAuth = useCallback(() => {
    if (!isLoading && !user) {
      router.push('/admin/login');
      return false;
    }
    return true;
  }, [user, isLoading, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    requireAuth,
    initAuth,
  };
}
