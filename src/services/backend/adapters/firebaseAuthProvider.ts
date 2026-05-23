// Firebase implementation of the AuthProvider port.
//
// Authenticates against Firebase Auth and maps the native Firebase user to the
// neutral SessionUser. Firebase manages its own session/token lifecycle, so
// this adapter does NOT touch services/auth/session.ts or tokens.ts (those are
// REST/JWT-only). The only shared state it writes is useSessionStore.
//
// Native-setup prerequisites (handled outside this file — see report/README):
//   - @react-native-firebase/app + auth installed and autolinked.
//   - android/app/google-services.json present and the Google Services gradle
//     plugin applied; iOS GoogleService-Info.plist present.
//   - For signInWithGoogle: the OAuth web client id in appConfig.googleSignIn
//     must belong to the same Firebase project.

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {AuthProvider, SessionUser} from '@/services/backend/ports/authProvider';
import {signInWithGoogle as googleSignInFlow} from '@/services/auth/googleSignIn';
import {useSessionStore} from '@/store/sessionStore';

function toSessionUser(u: FirebaseAuthTypes.User): SessionUser {
  return {
    id: u.uid,
    email: u.email ?? undefined,
    name: u.displayName ?? undefined,
  };
}

/** Map the Firebase user, persist it into the session store, and return it. */
function persist(u: FirebaseAuthTypes.User): SessionUser {
  const user = toSessionUser(u);
  useSessionStore.getState().setSession(user);
  return user;
}

export class FirebaseAuthProvider implements AuthProvider {
  async signIn(input: {email: string; password: string}): Promise<SessionUser> {
    const cred = await auth().signInWithEmailAndPassword(
      input.email,
      input.password,
    );
    return persist(cred.user);
  }

  async signUp(input: {email: string; password: string}): Promise<SessionUser> {
    const cred = await auth().createUserWithEmailAndPassword(
      input.email,
      input.password,
    );
    return persist(cred.user);
  }

  async signInWithGoogle(): Promise<SessionUser | null> {
    const result = await googleSignInFlow();
    if (!result) return null; // user cancelled
    const credential = auth.GoogleAuthProvider.credential(result.idToken);
    const cred = await auth().signInWithCredential(credential);
    return persist(cred.user);
  }

  async forgotPassword(input: {email: string}): Promise<void> {
    await auth().sendPasswordResetEmail(input.email);
  }

  async restoreSession(): Promise<SessionUser | null> {
    const current = auth().currentUser;
    if (!current) return null;
    return persist(current);
  }

  async getCurrentUser(): Promise<SessionUser> {
    const current = auth().currentUser;
    if (!current) {
      // Matches REST `/me` semantics — caller assumes an authed user exists.
      throw new Error('[firebase-auth] no current user');
    }
    return toSessionUser(current);
  }

  async signOut(): Promise<void> {
    await auth().signOut();
    useSessionStore.getState().clearSession();
  }
}
