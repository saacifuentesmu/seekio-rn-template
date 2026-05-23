import {api} from '@/services/api/client';
import {SessionUser, useSessionStore} from '@/store/sessionStore';

import {clearTokens, setTokens} from './tokens';

export type {SessionUser};

interface GoogleLoginResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
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
  const res = await api.post<GoogleLoginResponse>('/auth/google', {idToken});
  const {user, accessToken, refreshToken} = res.data;
  await startSession(user, accessToken, refreshToken);
  return user;
}
