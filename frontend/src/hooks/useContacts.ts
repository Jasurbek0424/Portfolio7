import { useQuery } from '@tanstack/react-query';
import { getContactInfo, type ContactItem } from '@/lib/api';

export function useContacts() {
  return useQuery<ContactItem[]>({
    queryKey: ['contacts'],
    queryFn: getContactInfo,
    placeholderData: (prev) => prev,
  });
}
