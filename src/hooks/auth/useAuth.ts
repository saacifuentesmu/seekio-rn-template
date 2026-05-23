import {useCallback} from 'react';

import {getAuthProvider} from '@/services/backend';
import {useSessionStore} from '@/store/sessionStore';

export function useAuth() {
  const {isAuthenticated, user} = useSessionStore();
  const signOut = useCallback(async () => {
    await getAuthProvider().signOut();
  }, []);
  return {isAuthenticated, user, signOut};
}
