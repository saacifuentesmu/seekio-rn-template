import {useMutation} from '@tanstack/react-query';

import {getAuthProvider} from '@/services/backend';
import {logger} from '@/utils/logger';

export function useForgotPassword() {
  const auth = getAuthProvider();
  return useMutation({
    mutationFn: (input: {email: string}) => auth.forgotPassword(input),
    onError: err => {
      logger.error('[useForgotPassword] failed:', err);
    },
  });
}
