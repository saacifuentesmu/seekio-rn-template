import {useMutation} from '@tanstack/react-query';

import {getAuthProvider} from '@/services/backend';
import {logger} from '@/utils/logger';

export function useSignUp() {
  const auth = getAuthProvider();
  return useMutation({
    mutationFn: (input: {email: string; password: string}) =>
      auth.signUp(input),
    onError: err => {
      logger.error('[useSignUp] failed:', err);
    },
  });
}
