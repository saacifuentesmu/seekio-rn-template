// REST + JWT implementation of the AuthProvider port.
//
// This is the template's default backend. It reuses the existing axios clients
// (services/api/client) and session/token helpers (services/auth/*), so all the
// REST-specific knowledge (endpoint paths, token storage) lives behind the port.

import {AuthProvider, SessionUser} from '@/services/backend/ports/authProvider';
import {apiPublic, api} from '@/services/api/client';
import {
  startSession,
  endSession,
  validateSession,
  loginWithGoogle,
} from '@/services/auth/session';
import {getAccessToken} from '@/services/auth/tokens';
import {signInWithGoogle as googleSignInFlow} from '@/services/auth/googleSignIn';
import {logger} from '@/utils/logger';

interface AuthResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  user: SessionUser;
}

export class RestAuthProvider implements AuthProvider {
  async signIn(input: {email: string; password: string}): Promise<SessionUser> {
    const res = await apiPublic.post<AuthResponse>('/auth/login', input);
    const {user, accessToken, refreshToken} = res.data;
    await startSession(user, accessToken, refreshToken);
    return user;
  }

  async signUp(input: {email: string; password: string}): Promise<SessionUser> {
    const res = await apiPublic.post<AuthResponse>('/auth/register', input);
    const {user, accessToken, refreshToken} = res.data;
    await startSession(user, accessToken, refreshToken);
    return user;
  }

  async signInWithGoogle(): Promise<SessionUser | null> {
    const result = await googleSignInFlow();
    if (!result) return null; // user cancelled
    return loginWithGoogle(result.idToken);
  }

  async forgotPassword(input: {email: string}): Promise<void> {
    await apiPublic.post('/auth/forgot-password', input);
  }

  async restoreSession(): Promise<SessionUser | null> {
    const token = await getAccessToken();
    if (!token) {
      logger.info('[rest-auth] no token, skipping restore');
      return null;
    }
    try {
      const user = await validateSession();
      return user;
    } catch (err) {
      logger.warn('[rest-auth] validation failed, clearing session:', err);
      try {
        await endSession();
      } catch (clearErr) {
        logger.warn('[rest-auth] endSession failed:', clearErr);
      }
      return null;
    }
  }

  async getCurrentUser(): Promise<SessionUser> {
    const res = await api.get<MeResponse>('/me');
    return res.data.user;
  }

  async signOut(): Promise<void> {
    await endSession();
  }
}
