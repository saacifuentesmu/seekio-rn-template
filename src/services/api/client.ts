import axios, {AxiosInstance} from 'axios';
import {
  applyAuthTokenInterceptor,
  TokenRefreshRequest,
} from 'react-native-axios-jwt';

import {env} from '@/config/env';
import {appConfig} from '@/constants/appConfig';
import {logger} from '@/utils/logger';

const baseURL = env.API_BASE_URL || appConfig.apiBaseUrls[env.ENV];

const baseConfig = {
  baseURL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
};

function attachErrorLogging(instance: AxiosInstance, label: string): void {
  instance.interceptors.response.use(
    res => res,
    err => {
      const cfg = err?.config;
      const method = cfg?.method?.toUpperCase() ?? '?';
      const url = cfg?.url
        ? `${cfg?.baseURL ?? ''}${cfg.url}`
        : err?.request?.responseURL ?? '';
      const status = err?.response?.status ?? 'no-response';
      logger.error(
        `[${label}] ${method} ${url} failed: ${status} ${err?.message ?? ''}`,
      );
      return Promise.reject(err);
    },
  );
}

// Public client: no auth header, no refresh interceptor. Use for /auth/login,
// /auth/register, /auth/google — requests that don't have a token yet and
// whose response *is* the token pair.
export const apiPublic = axios.create(baseConfig);
attachErrorLogging(apiPublic, 'api:public');

// Authenticated client: auto-attaches Bearer token and refreshes on 401.
// Use for everything else.
export const api = axios.create(baseConfig);
attachErrorLogging(api, 'api');

// Stub: replace with the real refresh endpoint for your backend.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string) => {
  const res = await apiPublic.post('/auth/refresh', {refreshToken});
  return {
    accessToken: res.data.accessToken as string,
    refreshToken: res.data.refreshToken as string,
  };
};

applyAuthTokenInterceptor(api, {
  requestRefresh,
  header: 'Authorization',
  headerPrefix: 'Bearer ',
});
