// Firebase implementation of the AuthProvider port — STUB.
//
// Exists to prove the port boundary holds: a second backend can be selected via
// appConfig.backend.auth = 'firebase' without touching any consumer. To make it
// real:
//   1. yarn add @react-native-firebase/app @react-native-firebase/auth
//   2. Drop google-services.json / GoogleService-Info.plist into the native projects.
//   3. Implement each method using `auth()` (e.g. signInWithEmailAndPassword,
//      createUserWithEmailAndPassword, signInWithCredential, sendPasswordResetEmail,
//      onAuthStateChanged, currentUser, signOut), mapping the Firebase user to
//      SessionUser and writing it into useSessionStore via the consuming hook.
//
// Kept as a pure stub (no firebase import) so the template compiles without the
// dependency installed.

import {AuthProvider, SessionUser} from '@/services/backend/ports/authProvider';

const NOT_IMPLEMENTED =
  'FirebaseAuthProvider not implemented — install @react-native-firebase/auth and implement (see file header)';

export class FirebaseAuthProvider implements AuthProvider {
  signIn(_input: {email: string; password: string}): Promise<SessionUser> {
    throw new Error(NOT_IMPLEMENTED);
  }

  signUp(_input: {email: string; password: string}): Promise<SessionUser> {
    throw new Error(NOT_IMPLEMENTED);
  }

  signInWithGoogle(): Promise<SessionUser | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  forgotPassword(_input: {email: string}): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  restoreSession(): Promise<SessionUser | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  getCurrentUser(): Promise<SessionUser> {
    throw new Error(NOT_IMPLEMENTED);
  }

  signOut(): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
