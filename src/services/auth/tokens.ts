import {clearAuthTokens, getAccessToken as libGetAccess, setAuthTokens} from 'react-native-axios-jwt';
import SInfo from 'react-native-sensitive-info';

const opts = {sharedPreferencesName: 'seekio.auth', keychainService: 'seekio.auth'};
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

// Mirror tokens to sensitive-info (secure) AND react-native-axios-jwt
// (where its interceptor reads them). sensitive-info is the source of truth
// across cold starts; the library is rehydrated on init from there if needed.

export async function setAccessToken(accessToken: string): Promise<void> {
  await SInfo.setItem(ACCESS_KEY, accessToken, opts);
  const refresh = (await SInfo.getItem(REFRESH_KEY, opts)) ?? '';
  await setAuthTokens({accessToken, refreshToken: refresh});
}

export async function setRefreshToken(refreshToken: string): Promise<void> {
  await SInfo.setItem(REFRESH_KEY, refreshToken, opts);
  const access = (await SInfo.getItem(ACCESS_KEY, opts)) ?? '';
  await setAuthTokens({accessToken: access, refreshToken});
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await SInfo.setItem(ACCESS_KEY, accessToken, opts);
  await SInfo.setItem(REFRESH_KEY, refreshToken, opts);
  await setAuthTokens({accessToken, refreshToken});
}

export async function getAccessToken(): Promise<string | undefined> {
  const lib = await libGetAccess();
  if (lib) return lib;
  const stored = await SInfo.getItem(ACCESS_KEY, opts);
  return stored ?? undefined;
}

export async function clearTokens(): Promise<void> {
  await SInfo.deleteItem(ACCESS_KEY, opts);
  await SInfo.deleteItem(REFRESH_KEY, opts);
  await clearAuthTokens();
}
