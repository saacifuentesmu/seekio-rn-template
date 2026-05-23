import {useMutation} from '@tanstack/react-query';

import {getAuthProvider} from '@/services/backend';
import {logger} from '@/utils/logger';

export function useLogin() {
  const auth = getAuthProvider();
  return useMutation({
    mutationFn: (input: {email: string; password: string}) =>
      auth.signIn(input),
    onError: err => {
      logger.error('[useLogin] failed:', err);
    },
  });
}
