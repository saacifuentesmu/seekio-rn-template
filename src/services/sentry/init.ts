import * as Sentry from '@sentry/react-native';

import {env} from '@/config/env';

export function initSentry(): void {
  if (__DEV__ || !env.SENTRY_DSN) return;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.ENV,
    tracesSampleRate: 0.1,
  });
}
