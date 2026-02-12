import axios, { type AxiosError } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error?: string }>) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('admin_token');
        window.localStorage.removeItem('admin_user');
        setAuthToken(null);
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; data: { token: string; user: { id: string; email: string; role: string } } }>(
      '/auth/login',
      { email, password }
    ),
};

// Blogs
export const blogsApi = {
  getAll: (lang = 'en') =>
    api.get<{ success: boolean; data: BlogPost[] }>(`/admin/blogs?lang=${lang}`),
  getById: (id: string) =>
    api.get<{ success: boolean; data: BlogPost }>(`/admin/blogs/id/${id}`),
  create: (data: CreateBlogInput) =>
    api.post<{ success: boolean; data: BlogPost }>('/admin/blogs', data),
  update: (id: string, data: UpdateBlogInput) =>
    api.put<{ success: boolean; data: BlogPost }>(`/admin/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/admin/blogs/${id}`),
};

// Projects
export const projectsApi = {
  getAll: (lang = 'en') =>
    api.get<{ success: boolean; data: Project[] }>(`/admin/projects?lang=${lang}`),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Project }>(`/admin/projects/id/${id}`),
  create: (data: CreateProjectInput) =>
    api.post<{ success: boolean; data: Project }>('/admin/projects', data),
  update: (id: string, data: UpdateProjectInput) =>
    api.put<{ success: boolean; data: Project }>(`/admin/projects/${id}`, data),
  delete: (id: string) => api.delete(`/admin/projects/${id}`),
};

// Resume
export const resumeApi = {
  getAll: (lang = 'en') =>
    api.get<{ success: boolean; data: ResumeSection[] }>(`/admin/resume?lang=${lang}`),
  getById: (id: string) =>
    api.get<{ success: boolean; data: ResumeSection }>(`/admin/resume/id/${id}`),
  create: (data: CreateResumeSectionInput) =>
    api.post<{ success: boolean; data: ResumeSection }>('/admin/resume', data),
  update: (id: string, data: UpdateResumeSectionInput) =>
    api.put<{ success: boolean; data: ResumeSection }>(`/admin/resume/${id}`, data),
  delete: (id: string) => api.delete(`/admin/resume/${id}`),
  getCvInfo: () =>
    api.get<{ success: boolean; data: { fileName: string } }>('/admin/resume/cv'),
  uploadCv: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ success: boolean; data: { fileName: string; url: string } }>(
      '/admin/resume/cv',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};

export interface Contact {
  id: string;
  type: string;
  icon?: string | null;
  label?: string | null;
  value: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ContactType = 'email' | 'github' | 'linkedin' | 'instagram' | 'telegram' | 'other';
export type ContactIcon = 'mail' | 'github' | 'linkedin' | 'instagram' | 'send' | 'link';

export interface CreateContactInput {
  type: ContactType;
  icon?: ContactIcon | null;
  label?: string | null;
  value: string;
  sortOrder?: number;
}

export type UpdateContactInput = Partial<CreateContactInput>;

export const contactApi = {
  getAll: () =>
    api.get<{ success: boolean; data: Contact[] }>('/admin/contact'),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Contact }>(`/admin/contact/id/${id}`),
  create: (data: CreateContactInput) =>
    api.post<{ success: boolean; data: Contact }>('/admin/contact', data),
  update: (id: string, data: UpdateContactInput) =>
    api.put<{ success: boolean; data: Contact }>(`/admin/contact/${id}`, data),
  delete: (id: string) => api.delete(`/admin/contact/${id}`),
};

// Types (matching backend schema)
export interface BlogPost {
  id: string;
  slug: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUz: string;
  contentEn: string;
  contentRu: string;
  contentUz: string;
  thumbnail?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogInput {
  slug: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUz: string;
  contentEn: string;
  contentRu: string;
  contentUz: string;
  thumbnail?: string | null;
  published?: boolean;
}

export type UpdateBlogInput = Partial<CreateBlogInput>;

export interface Project {
  id: string;
  slug: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUz: string;
  techStack: string[];
  thumbnail?: string | null;
  linkUrl?: string | null;
  githubUrl?: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  slug: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUz: string;
  techStack?: string[];
  thumbnail?: string | null;
  linkUrl?: string | null;
  githubUrl?: string | null;
  published?: boolean;
  sortOrder?: number;
}

export type UpdateProjectInput = Partial<CreateProjectInput>;

export interface ResumeSection {
  id: string;
  sectionKey: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  contentEn: string;
  contentRu: string;
  contentUz: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeSectionInput {
  sectionKey: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  contentEn: string;
  contentRu: string;
  contentUz: string;
  sortOrder?: number;
}

export type UpdateResumeSectionInput = Partial<CreateResumeSectionInput>;

// Skill categories
export interface SkillCategory {
  id: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  sortOrder: number;
  skills?: Skill[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillCategoryInput {
  titleEn: string;
  titleRu: string;
  titleUz: string;
  sortOrder?: number;
}

export type UpdateSkillCategoryInput = Partial<CreateSkillCategoryInput>;

export const skillCategoriesApi = {
  getAll: () =>
    api.get<{ success: boolean; data: SkillCategory[] }>('/admin/skills/categories'),
  getById: (id: string) =>
    api.get<{ success: boolean; data: SkillCategory }>(`/admin/skills/categories/id/${id}`),
  create: (data: CreateSkillCategoryInput) =>
    api.post<{ success: boolean; data: SkillCategory }>('/admin/skills/categories', data),
  update: (id: string, data: UpdateSkillCategoryInput) =>
    api.put<{ success: boolean; data: SkillCategory }>(`/admin/skills/categories/${id}`, data),
  delete: (id: string) => api.delete(`/admin/skills/categories/${id}`),
};

// Skills
export interface Skill {
  id: string;
  skillCategoryId: string;
  skillCategory?: SkillCategory;
  label: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillInput {
  skillCategoryId: string;
  label: string;
  sortOrder?: number;
}

export type UpdateSkillInput = Partial<CreateSkillInput>;

export const skillsApi = {
  getAll: () =>
    api.get<{ success: boolean; data: Skill[] }>('/admin/skills'),
  getById: (id: string) =>
    api.get<{ success: boolean; data: Skill }>(`/admin/skills/id/${id}`),
  create: (data: CreateSkillInput) =>
    api.post<{ success: boolean; data: Skill }>('/admin/skills', data),
  update: (id: string, data: UpdateSkillInput) =>
    api.put<{ success: boolean; data: Skill }>(`/admin/skills/${id}`, data),
  delete: (id: string) => api.delete(`/admin/skills/${id}`),
};

// Upload
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ success: boolean; data: { url: string; filename: string } }>(
      '/admin/upload/image',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
};
