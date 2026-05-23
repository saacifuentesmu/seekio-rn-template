import axios from 'axios';
import {applyAuthTokenInterceptor, TokenRefreshRequest} from 'react-native-axios-jwt';

import {env} from '@/config/env';
import {appConfig} from '@/constants/appConfig';
import {logger} from '@/utils/logger';

const baseURL = env.API_BASE_URL || appConfig.apiBaseUrls[env.ENV];

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.response.use(
  res => res,
  err => {
    const cfg = err?.config;
    const method = cfg?.method?.toUpperCase() ?? '?';
    const url = `${cfg?.baseURL ?? ''}${cfg?.url ?? ''}`;
    const status = err?.response?.status ?? 'no-response';
    logger.error(`[api] ${method} ${url} failed: ${status} ${err?.message ?? ''}`);
    return Promise.reject(err);
  },
);

// Stub: replace with the real refresh endpoint for your backend.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string) => {
  const res = await axios.post(`${baseURL}/auth/refresh`, {refreshToken});
  return {
    accessToken: res.data.accessToken as string,
    refreshToken: res.data.refreshToken as string,
  };
};

applyAuthTokenInterceptor(api, {requestRefresh, header: 'Authorization', headerPrefix: 'Bearer '});
