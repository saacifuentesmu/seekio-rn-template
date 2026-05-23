declare module 'react-native-config' {
  export interface NativeConfig {
    ENV?: string;
    API_BASE_URL?: string;
    SENTRY_DSN?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
