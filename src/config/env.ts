import Config from 'react-native-config';

export type Environment = 'dev' | 'staging' | 'prod';

export const env = {
  ENV: (Config.ENV ?? 'dev') as Environment,
  API_BASE_URL: Config.API_BASE_URL ?? '',
  SENTRY_DSN: Config.SENTRY_DSN ?? '',
};
