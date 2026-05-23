declare module 'react-native-config' {
  export interface NativeConfig {
    ENV?: string;
    API_BASE_URL?: string;
    SENTRY_DSN?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    GOOGLE_IOS_CLIENT_ID?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
