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
  googleSignIn: {
    webClientId: string;
    iosClientId: string;
    offlineAccess: boolean;
  };
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
  googleSignIn: {
    // OAuth 2.0 Web client ID from Google Cloud Console (required for ID token issuance
    // on both Android and iOS). Leave empty to disable Google Sign-In.
    webClientId: '',
    // iOS-only: reversed-client-id URL scheme also needs to be added to ios/<App>/Info.plist
    // under CFBundleURLTypes. See README.
    iosClientId: '',
    // Optional: request offline access (server-side refresh token via serverAuthCode).
    offlineAccess: false,
  },
};
