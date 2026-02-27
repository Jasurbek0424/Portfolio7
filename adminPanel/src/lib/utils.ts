import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiError(err: unknown, fallback = 'Something went wrong'): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err
  ) {
    const axiosErr = err as { response?: { data?: { error?: string } } };
    if (axiosErr.response?.data?.error) return axiosErr.response.data.error;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export const TOKEN_KEY = 'admin_token';
export const USER_KEY = 'admin_user';
