import {useCallback} from 'react';

import {endSession} from '@/services/auth/session';
import {useSessionStore} from '@/store/sessionStore';

export function useAuth() {
  const {isAuthenticated, user} = useSessionStore();
  const signOut = useCallback(async () => {
    await endSession();
  }, []);
  return {isAuthenticated, user, signOut};
}
