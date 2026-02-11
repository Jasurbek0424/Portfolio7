import { useQuery } from '@tanstack/react-query';
import { getProjects, type ProjectPublic } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export function useProjects() {
  const { language } = useLanguage();

  return useQuery<ProjectPublic[]>({
    queryKey: ['projects', language],
    queryFn: () => getProjects(language),
    placeholderData: (prev) => prev,
  });
}
