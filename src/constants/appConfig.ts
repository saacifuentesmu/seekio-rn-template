// Single source of product config. Change values here when forking this template.

export interface AppConfig {
  appName: string;
  companyName: string;
  bundleIds: {dev: string; staging: string; prod: string};
  apiBaseUrls: {dev: string; staging: string; prod: string};
  bleServiceUuids: string[];
  defaultLocale: string;
  supportedLocales: string[];
  featureFlags: {ble: boolean; maps: boolean; push: boolean};
}

export const appConfig: AppConfig = {
  appName: 'Seekio RN Template',
  companyName: 'Seekio',
  bundleIds: {
    dev: 'io.seekio.rntemplate.dev',
    staging: 'io.seekio.rntemplate.staging',
    prod: 'io.seekio.rntemplate',
  },
  apiBaseUrls: {
    dev: 'https://api.dev.example.com',
    staging: 'https://api.staging.example.com',
    prod: 'https://api.example.com',
  },
  bleServiceUuids: [],
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  featureFlags: {ble: true, maps: true, push: true},
};
