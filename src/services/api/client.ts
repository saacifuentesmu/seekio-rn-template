import axios from 'axios';
import {applyAuthTokenInterceptor, TokenRefreshRequest} from 'react-native-axios-jwt';

import {env} from '@/config/env';
import {appConfig} from '@/constants/appConfig';

const baseURL = env.API_BASE_URL || appConfig.apiBaseUrls[env.ENV];

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

// Stub: replace with the real refresh endpoint for your backend.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string) => {
  const res = await axios.post(`${baseURL}/auth/refresh`, {refreshToken});
  return {
    accessToken: res.data.accessToken as string,
    refreshToken: res.data.refreshToken as string,
  };
};

applyAuthTokenInterceptor(api, {requestRefresh, header: 'Authorization', headerPrefix: 'Bearer '});
