/* eslint-env jest */

// Native modules with no JS fallback under jest; mock them so importing the
// component tree doesn't hit TurboModuleRegistry.getEnforcing.

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-gesture-handler', () => ({}));

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-sensitive-info', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  deleteItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-ble-plx', () => ({
  BleManager: jest.fn(() => ({
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
    destroy: jest.fn(),
  })),
}));

jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}));

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(),
    signOut: jest.fn(() => Promise.resolve()),
  },
  statusCodes: {SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED'},
}));

// Firebase modules ship as ESM and have no JS fallback under jest; mock the
// callable default exports used by the firebase* backend adapters so importing
// the composition root (services/backend/index) doesn't crash the suite.
jest.mock('@react-native-firebase/auth', () => {
  const authFn = jest.fn();
  authFn.GoogleAuthProvider = {credential: jest.fn()};
  return {__esModule: true, default: authFn};
});

jest.mock('@react-native-firebase/firestore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@react-native-firebase/storage', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(() => Promise.resolve('default')),
    requestPermission: jest.fn(() => Promise.resolve()),
    displayNotification: jest.fn(() => Promise.resolve()),
  },
  AndroidImportance: {HIGH: 4},
}));

jest.mock('react-native-splash-screen', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  findBestLanguageTag: jest.fn(() => ({languageTag: 'en', isRTL: false})),
  getLocales: jest.fn(() => [
    {languageTag: 'en', languageCode: 'en', isRTL: false},
  ]),
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  ENV: 'dev',
  API_BASE_URL: 'http://localhost:3000',
  SENTRY_DSN: '',
  GOOGLE_WEB_CLIENT_ID: '',
  GOOGLE_IOS_CLIENT_ID: '',
}));
