import {useMutation} from '@tanstack/react-query';

import {apiPublic} from '@/services/api/client';
import {startSession} from '@/services/auth/session';
import {logger} from '@/utils/logger';

interface SignUpInput {
  email: string;
  password: string;
}

interface SignUpResponse {
  user: {id: string; email?: string; name?: string};
  accessToken: string;
  refreshToken: string;
}

async function signUpRequest(input: SignUpInput): Promise<SignUpResponse> {
  const res = await apiPublic.post<SignUpResponse>('/auth/register', input);
  return res.data;
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUpRequest,
    onSuccess: async data => {
      await startSession(data.user, data.accessToken, data.refreshToken);
    },
    onError: err => {
      logger.error('[useSignUp] failed:', err);
    },
  });
}
