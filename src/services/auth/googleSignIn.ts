import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {appConfig} from '@/constants/appConfig';
import {logger} from '@/utils/logger';

export interface GoogleSignInResult {
  idToken: string;
  email: string;
  name: string | null;
}

export function configureGoogleSignIn(): void {
  const {webClientId, iosClientId, offlineAccess} = appConfig.googleSignIn;
  if (!webClientId) {
    logger.warn(
      'Google Sign-In not configured: appConfig.googleSignIn.webClientId is empty',
    );
    return;
  }
  GoogleSignin.configure({
    webClientId,
    ...(iosClientId ? {iosClientId} : {}),
    offlineAccess,
  });
}

export async function signInWithGoogle(): Promise<GoogleSignInResult | null> {
  try {
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();
    // RNGoogleSignin 11.x returns {idToken, user: {email, name, ...}} at the top level
    // (no `data` wrapper). Read defensively to tolerate either shape.
    const payload = (result as {data?: unknown}).data ?? result;
    const {idToken, user} = payload as {
      idToken: string | null;
      user: {email: string; name: string | null};
    };
    if (!idToken) {
      throw new Error('Google Sign-In returned no idToken');
    }
    return {idToken, email: user.email, name: user.name};
  } catch (err) {
    const code = (err as {code?: string}).code;
    if (code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }
    throw err;
  }
}

export async function signOutFromGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch (err) {
    logger.warn('Google Sign-Out failed', err);
  }
}
