// Composition root: selects backend adapters from appConfig and exposes them to
// consumers as the port interface. This is the ONLY place that knows which
// concrete backend is wired. Hooks/screens call getAuthProvider() and depend on
// AuthProvider, never on a specific adapter.

import {appConfig} from '@/constants/appConfig';
import {AuthProvider} from '@/services/backend/ports/authProvider';
import {RestAuthProvider} from '@/services/backend/adapters/restAuthProvider';
import {FirebaseAuthProvider} from '@/services/backend/adapters/firebaseAuthProvider';

let authInstance: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (!authInstance) {
    authInstance =
      appConfig.backend.auth === 'firebase'
        ? new FirebaseAuthProvider()
        : new RestAuthProvider();
  }
  return authInstance;
}

/** Hook form for idiomatic use inside components/hooks. */
export function useAuthProvider(): AuthProvider {
  return getAuthProvider();
}

export type {AuthProvider} from '@/services/backend/ports/authProvider';
