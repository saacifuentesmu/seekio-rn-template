import {api, apiPublic} from '@/services/api/client';
import {SessionUser, useSessionStore} from '@/store/sessionStore';

import {clearTokens, setTokens} from './tokens';

export type {SessionUser};

interface GoogleLoginResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  user: SessionUser;
}

export async function validateSession(): Promise<SessionUser> {
  const res = await api.get<MeResponse>('/me');
  return res.data.user;
}

export async function startSession(user: SessionUser, accessToken: string, refreshToken: string) {
  await setTokens(accessToken, refreshToken);
  useSessionStore.getState().setSession(user);
}

export async function endSession() {
  await clearTokens();
  useSessionStore.getState().clearSession();
}

export async function loginWithGoogle(idToken: string): Promise<SessionUser> {
  const res = await apiPublic.post<GoogleLoginResponse>('/auth/google', {idToken});
  const {user, accessToken, refreshToken} = res.data;
  await startSession(user, accessToken, refreshToken);
  return user;
}
