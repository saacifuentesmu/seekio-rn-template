import {useMutation} from '@tanstack/react-query';

import {api} from '@/services/api/client';
import {startSession} from '@/services/auth/session';
import {logger} from '@/utils/logger';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {id: string; email?: string; name?: string};
  accessToken: string;
  refreshToken: string;
}

// Stub mutation. Replace endpoint to match your backend.
async function loginRequest(input: LoginInput): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', input);
  return res.data;
}

export function useLogin() {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async data => {
      await startSession(data.user, data.accessToken, data.refreshToken);
    },
    onError: err => {
      logger.error('[useLogin] failed:', err);
    },
  });
}
