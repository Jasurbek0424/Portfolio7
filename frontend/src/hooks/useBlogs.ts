import { useQuery } from '@tanstack/react-query';
import { getBlogs, type BlogPostPublic } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export function useBlogs() {
  const { language } = useLanguage();

  return useQuery<BlogPostPublic[]>({
    queryKey: ['blogs', language],
    queryFn: () => getBlogs(language),
    placeholderData: (prev) => prev,
  });
}
