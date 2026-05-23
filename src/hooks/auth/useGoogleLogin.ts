import {useMutation} from '@tanstack/react-query';

import {getAuthProvider} from '@/services/backend';
import {logger} from '@/utils/logger';

export function useGoogleLogin() {
  const auth = getAuthProvider();
  const mutation = useMutation({
    // Resolves to the user, or null when the user cancels.
    mutationFn: () => auth.signInWithGoogle(),
    onError: err => {
      logger.error('[useGoogleLogin] failed:', err);
    },
  });
  return {
    signIn: () => mutation.mutate(),
    isPending: mutation.isPending,
    error: mutation.isError ? mutation.error : null,
  };
}
