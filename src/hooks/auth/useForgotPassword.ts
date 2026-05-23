import {useMutation} from '@tanstack/react-query';

import {apiPublic} from '@/services/api/client';
import {logger} from '@/utils/logger';

interface ForgotPasswordInput {
  email: string;
}

interface ForgotPasswordResponse {
  ok: boolean;
}

async function forgotPasswordRequest(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResponse> {
  const res = await apiPublic.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    input,
  );
  return res.data;
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onError: err => {
      logger.error('[useForgotPassword] failed:', err);
    },
  });
}
