import {useMutation} from '@tanstack/react-query';

import {loginWithGoogle} from '@/services/auth/session';
import {signInWithGoogle} from '@/services/auth/googleSignIn';
import {logger} from '@/utils/logger';

async function googleSignInFlow(): Promise<{cancelled: boolean}> {
  const result = await signInWithGoogle();
  if (!result) return {cancelled: true};
  await loginWithGoogle(result.idToken);
  return {cancelled: false};
}

export function useGoogleLogin() {
  const mutation = useMutation({
    mutationFn: googleSignInFlow,
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
