import { useQuery } from '@tanstack/react-query';
import { getSkills, type SkillCategoryPublic } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export function useSkills() {
  const { language } = useLanguage();

  return useQuery<SkillCategoryPublic[]>({
    queryKey: ['skills', language],
    queryFn: () => getSkills(language),
    placeholderData: (prev) => prev, // avvalgi til keshini ko'rsatib turadi
  });
}
