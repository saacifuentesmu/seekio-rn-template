import {SessionUser, useSessionStore} from '@/store/sessionStore';

import {clearTokens, setTokens} from './tokens';

export type {SessionUser};

export async function startSession(user: SessionUser, accessToken: string, refreshToken: string) {
  await setTokens(accessToken, refreshToken);
  useSessionStore.getState().setSession(user);
}

export async function endSession() {
  await clearTokens();
  useSessionStore.getState().clearSession();
}
