const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/** Validate that a URL uses a safe protocol (http/https only) */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  // Allow relative URLs (start with /)
  if (url.startsWith('/')) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function resolveUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) {
    return isSafeUrl(url) ? url : null;
  }
  return `${API_BASE}${url}`;
}

const DEFAULT_TIMEOUT_MS = 12000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 1500;

export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options?: { timeoutMs?: number; retries?: number; delayMs?: number }
): Promise<Response> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options?.retries ?? DEFAULT_RETRIES;
  const delayMs = options?.delayMs ?? DEFAULT_RETRY_DELAY_MS;
  let lastError: unknown;
  let lastResponse: Response | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.status === 429 && attempt < retries) {
        lastResponse = res;
        const retryAfter = Number(res.headers.get('Retry-After'));
        await new Promise((r) => setTimeout(r, retryAfter > 0 ? retryAfter * 1000 : 5000));
        continue;
      }
      return res;
    } catch (e) {
      clearTimeout(timeoutId);
      lastError = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  if (lastResponse) return lastResponse;
  throw lastError;
}

export interface ContactItem {
  id: string;
  type: string;
  icon?: string | null;
  label?: string | null;
  value: string;
  sortOrder: number;
}

export async function getCvDownloadUrl(): Promise<string | null> {
  const res = await fetchWithRetry(`${API_BASE}/api/resume/cv`);
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.url ?? null;
}

export interface SkillCategoryPublic {
  id: string;
  title: string;
  sortOrder: number;
  skills: { id: string; label: string; sortOrder: number }[];
}

export async function getSkills(lang: string): Promise<SkillCategoryPublic[]> {
  const res = await fetchWithRetry(`${API_BASE}/api/skills?lang=${lang}`);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export interface ProjectPublic {
  id: string;
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  thumbnail?: string | null;
  linkUrl?: string | null;
  githubUrl?: string | null;
  sortOrder: number;
}

export async function getProjects(lang: string): Promise<ProjectPublic[]> {
  const res = await fetchWithRetry(`${API_BASE}/api/projects?lang=${lang}`);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export interface BlogPostPublic {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string | null;
  published: boolean;
  createdAt: string;
}

export async function getBlogs(lang: string): Promise<BlogPostPublic[]> {
  const res = await fetchWithRetry(`${API_BASE}/api/blogs?lang=${lang}`);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export async function getBlogBySlug(slug: string, lang: string): Promise<BlogPostPublic | null> {
  const res = await fetchWithRetry(`${API_BASE}/api/blogs/${slug}?lang=${lang}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}

export async function getContactInfo(): Promise<ContactItem[]> {
  const res = await fetchWithRetry(`${API_BASE}/api/contact`);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export interface SendMessagePayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(payload: SendMessagePayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/api/contact/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: json?.error || 'Message could not be sent' };
    }
    return { success: json?.success === true, error: json?.error };
  } catch (e) {
    console.error('sendContactMessage failed:', e);
    return { success: false, error: 'Network error' };
  }
}
