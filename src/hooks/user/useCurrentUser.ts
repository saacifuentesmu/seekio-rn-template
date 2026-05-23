import {useQuery} from '@tanstack/react-query';

import {api} from '@/services/api/client';
import {SessionUser} from '@/store/sessionStore';

interface MeResponse {
  user: SessionUser;
}

async function fetchMe(): Promise<SessionUser> {
  const res = await api.get<MeResponse>('/me');
  return res.data.user;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
  });
}
