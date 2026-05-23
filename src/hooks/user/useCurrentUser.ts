import {useQuery} from '@tanstack/react-query';

import {getAuthProvider} from '@/services/backend';

export function useCurrentUser() {
  const auth = getAuthProvider();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => auth.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}
