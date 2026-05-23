# Seekio RN Template

> Generic React Native starter for IoT companion apps. Structured as a **starting point**: product-specific values live in **one file** (`src/constants/appConfig.ts`) so a new product is a rebrand, not a rewrite.

## Stack

| Layer | Choice |
|-------|--------|
| Navigation | `@react-navigation/native` (native-stack + bottom-tabs) |
| State (server) | TanStack Query (+ AsyncStorage persister) |
| State (client) | Zustand |
| Networking | Axios + `react-native-axios-jwt` (refresh) |
| Secure storage | `react-native-sensitive-info` |
| Storage | `@react-native-async-storage/async-storage` |
| BLE | `react-native-ble-plx` (singleton manager + scan/connect hooks) |
| Maps / Geo | `react-native-maps`, `@react-native-community/geolocation` |
| Push | `@notifee/react-native` (local notifications; FCM via `@react-native-firebase/messaging` is opt-in — see Push below) |
| i18n | `i18next` + `react-i18next` + `react-native-localize` (EN, ES) |
| Telemetry | `@sentry/react-native` (skipped in dev / when DSN empty) |
| Forms | `react-hook-form` + `yup` |
| Flavors | Android product flavors (dev/staging/prod) + iOS xcconfigs |
| Testing | Jest + `react-test-renderer` |
| Linting | ESLint (`@react-native` + `eslint-plugin-import`) |
| Path aliases | `babel-plugin-module-resolver` (`@/*` -> `src/*`) |

## Setup

```bash
yarn install

# Copy and edit env per environment
cp .env.example .env.dev
cp .env.example .env.staging
cp .env.example .env.prod

# iOS
cd ios && pod install && cd ..

# Run
yarn android:dev          # or android:staging, android:prod
yarn ios:dev              # or ios:staging, ios:prod (requires Xcode schemes - see below)
```

For testing the auth UI without a real backend, see [TESTING.md](TESTING.md) (local stub server + Google Sign-In end-to-end setup).

## Project Structure

```
src/
  constants/appConfig.ts        # SINGLE rebrand file
  config/env.ts                 # typed wrapper over react-native-config
  navigation/                   # RootNavigator + Auth/App stacks + types
  screens/                      # auth, home, devices, settings
  components/                   # UI primitives + form helpers
  hooks/                        # auth, ble, location, permissions
  services/
    api/                        # axios client + TanStack Query client
    auth/                       # tokens (secure) + session helpers
    ble/                        # BleManager singleton
    push/                       # PushService interface + Notifee impl
    sentry/                     # init (no-op in dev / when DSN empty)
    storage/                    # AsyncStorage wrapper
  store/                        # zustand stores (session, settings)
  i18n/                         # i18next init + en/es resources
  theme/                        # palette + spacing + typography + provider
  utils/                        # logger, errors
  App.tsx                       # composes all providers
```

## Backend architecture (Ports & Adapters)

The backend lives behind interfaces so a product can target any backend (REST,
Firebase, Azure, AWS) by writing one adapter and flipping one config value —
consumers never change. See [`../BACKEND_PORTS.md`](../BACKEND_PORTS.md) for the
full pattern.

- **Ports** (interfaces): `src/services/backend/ports/`
- **Adapters** (impls): `src/services/backend/adapters/` — `RestAuthProvider`
  (default) + `FirebaseAuthProvider` (stub)
- **Composition root**: `src/services/backend/index.ts` — `getAuthProvider()`
  selects the adapter from `appConfig.backend.auth`
- **Switch backend**: set `appConfig.backend.auth` (`'rest' | 'firebase'`)

The **auth** path is the reference implementation. `DataStore`, `FileStore`, and
`DevicePairing` ports follow the same shape (not yet extracted).

## Customizing for a New Product

All product-specific values live in **one file**: `src/constants/appConfig.ts`.

| What | Field | Example |
|------|-------|---------|
| App name | `appName` | `'Seekio RN Template'` |
| Company | `companyName` | `'Seekio'` |
| Bundle IDs | `bundleIds.{dev,staging,prod}` | `'io.seekio.rntemplate.dev'` |
| API base URLs | `apiBaseUrls.{dev,staging,prod}` | `'https://api.example.com'` |
| BLE filter | `bleServiceUuids` | `['0000180a-...']` |
| Default locale | `defaultLocale` | `'en'` |
| Supported locales | `supportedLocales` | `['en', 'es']` |
| Feature flags | `featureFlags.{ble,maps,push}` | `true` |
| Google Sign-In | `googleSignIn.{webClientId,iosClientId,offlineAccess}` | `''` (disabled) |

### Full rebrand checklist

1. **`src/constants/appConfig.ts`** - update every value.
2. **`package.json`** - change `name`.
3. **`app.json`** - change `name` and `displayName`.
4. **Android `applicationId`** - `android/app/build.gradle` (`applicationId`, `namespace`).
5. **Android Kotlin package dir** - rename `android/app/src/main/java/io/seekio/rntemplate/` and update `package` in `MainActivity.kt` and `MainApplication.kt`. Also update `<string name="build_config_package">` in `android/app/src/main/res/values/strings.xml` to the new namespace — `react-native-config` uses it to locate the generated `BuildConfig` class, and silently returns empty values in JS if it's wrong.
6. **Android flavor display names** - `productFlavors { ... resValue "string", "app_name", "..." }` in `android/app/build.gradle`.
7. **iOS bundle IDs / display names** - `ios/Config/{Dev,Staging,Prod}.xcconfig`.
8. **iOS schemes** - see "iOS Schemes Setup" below.
9. **App icons & splash** - add your assets under `android/app/src/main/res/mipmap-*/` and the iOS asset catalog; configure `react-native-splash-screen`. (Not bundled - left to the consumer.)
10. **Firebase config** - drop `android/app/google-services.json` and `ios/GoogleService-Info.plist` (not bundled - set up your own Firebase project).
11. **i18n** - edit `src/i18n/locales/en.json` and `es.json` for your domain vocabulary.
12. **Storage namespaces** - rename `'seekio.query-cache'` in `src/services/api/queryClient.ts` and `'seekio.auth'` in `src/services/auth/tokens.ts` so forks don't share cache or keychain entries on the same device.
13. **Search-and-replace** the placeholder name:
    ```bash
    grep -rl 'SeekioRnTemplate' . --exclude-dir=node_modules --exclude-dir=ios/Pods | xargs sed -i 's/SeekioRnTemplate/YourApp/g'
    ```

## iOS Schemes Setup (manual)

The `.pbxproj` is fragile, so schemes are not pre-configured. After `pod install`:

1. Open `ios/SeekioRnTemplate.xcworkspace` in Xcode.
2. **Product -> Scheme -> Manage Schemes...** -> duplicate the default scheme three times: `SeekioRnTemplate-Dev`, `SeekioRnTemplate-Staging`, `SeekioRnTemplate-Prod`.
3. **Project -> Info -> Configurations**: add three configurations (`Debug-Dev`, `Debug-Staging`, `Debug-Prod`, plus `Release-*` if needed) and point each at the matching `ios/Config/{Dev,Staging,Prod}.xcconfig`.
4. For each duplicated scheme, set its **Run** build configuration to the matching `Debug-*`.
5. In **Build Settings**, leave `PRODUCT_BUNDLE_IDENTIFIER`, `DISPLAY_NAME`, and `ENVFILE` to inherit from xcconfig.
6. In `Info.plist`, set `CFBundleDisplayName` to `$(DISPLAY_NAME)` and `CFBundleIdentifier` to `$(PRODUCT_BUNDLE_IDENTIFIER)`.

The `yarn ios:dev` / `yarn ios:staging` / `yarn ios:prod` scripts launch via those schemes.

## Android Flavors

Pre-wired in `android/app/build.gradle`:

| Flavor | applicationId | Display name |
|--------|---------------|--------------|
| dev | `io.seekio.rntemplate.dev` | Seekio RN (Dev) |
| staging | `io.seekio.rntemplate.staging` | Seekio RN (Staging) |
| prod | `io.seekio.rntemplate` | Seekio RN |

Build:

```bash
yarn android:dev               # devDebug
yarn android:apk:staging       # stagingRelease APK
```

## Capabilities

**Auth + JWT** - `services/api/client.ts` wires axios with `react-native-axios-jwt` for automatic refresh. Tokens are stored in the keychain / encrypted SharedPreferences via `services/auth/tokens.ts`. The login mutation lives in `hooks/auth/useLogin.ts` - replace the endpoint to match your backend. Sign-up is wired symmetrically: `/auth/register` endpoint, `useSignUp` hook, `SignUpScreen` linked from `LoginScreen`. Forgot-password stub: `/auth/forgot-password`, `useForgotPassword`, `ForgotPasswordScreen` linked from `LoginScreen`.

**Session restore** - on cold start, `useSessionRestore` reads the stored access token (sensitive-info) and calls `GET /me` via the authenticated client; on success the session is rehydrated, on failure tokens are cleared. While restoring, `RootNavigator` renders a JS-only `SplashView` placeholder.

**Theme** - multi-palette (default / forest / slate) × light / dark / system in `theme/palette.ts`. `ThemeProvider` resolves the active palette from `useSettingsStore` and `useColorScheme()`. Picker UI in `SettingsScreen` updates the theme live; `paletteName`, `themeMode`, and `locale` are persisted to AsyncStorage under `seekio.settings` via `zustand/middleware`.

**BLE** - `services/ble/bleManager.ts` exposes a lazy singleton. `hooks/ble/useBleScan.ts` returns a list of devices filtered by `appConfig.bleServiceUuids`. `hooks/ble/useBleDevice.ts` handles connect / disconnect / characteristic monitoring - characteristic UUIDs are passed as arguments, so the hook stays product-agnostic.

**Maps** - `react-native-maps` is installed. Add Google Maps API keys per the package README (`AndroidManifest.xml` meta-data + iOS AppDelegate) when you wire up a map view.

**Push** - `services/push/notifeeService.ts` implements the generic `PushService` interface with local notifications via Notifee. FCM is opt-in to keep the default build working without Firebase config files:

```bash
yarn add @react-native-firebase/app @react-native-firebase/messaging
```

Drop `google-services.json` into `android/app/` and `GoogleService-Info.plist` into the iOS target, then replace the stubs in `getToken()` / `onMessage()` per the comment in `notifeeService.ts`.

**Telemetry** - `services/sentry/init.ts` skips Sentry when `SENTRY_DSN` is empty or in `__DEV__`. Add the DSN to `.env.prod` (and run a release build) to enable.

**Flavors** - three environments end-to-end: env files, Android product flavors, iOS xcconfigs.

### Google Sign-In (optional)

Disabled by default (empty `webClientId` in `appConfig.googleSignIn`). To enable:

1. **Google Cloud Console** -> APIs & Services -> Credentials. Create OAuth 2.0 client IDs:
   - **Web application** - copy its client ID into `appConfig.googleSignIn.webClientId`. (This is the ID token audience; required on both platforms.)
   - **Android** - add one per flavor. Package name = the flavor's applicationId (e.g. `io.seekio.rntemplate.dev`). SHA-1 = your debug keystore (`./gradlew signingReport` from `android/`) for dev/staging; release keystore for prod.
   - **iOS** - copy its client ID into `appConfig.googleSignIn.iosClientId`. Note its *reversed* form (looks like `com.googleusercontent.apps.123-abc`).

2. **iOS only** - add the reversed client ID to `ios/SeekioRnTemplate/Info.plist`:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>com.googleusercontent.apps.YOUR-REVERSED-ID</string>
       </array>
     </dict>
   </array>
   ```

3. **Backend** - implement `POST /auth/google` accepting `{idToken: string}`, verifying it against Google's JWKS (audience = your `webClientId`), and returning `{accessToken, refreshToken, user}` in the same shape as your email/password login.

## Quick Reference: Files to Touch

| What | File(s) |
|------|---------|
| All product config | `src/constants/appConfig.ts` |
| Theme / palette | `src/theme/palette.ts` |
| All UI strings | `src/i18n/locales/{en,es}.json` |
| Environment secrets | `.env.{dev,staging,prod}` |
| Android app ID / flavors | `android/app/build.gradle` |
| Android package dir | `android/app/src/main/java/io/seekio/rntemplate/` |
| iOS bundle IDs / display names | `ios/Config/{Dev,Staging,Prod}.xcconfig` |
| Firebase config | `android/app/google-services.json`, `ios/GoogleService-Info.plist` (consumer-provided) |
| Navigation | `src/navigation/RootNavigator.tsx` |
| Add a feature | `src/screens/`, `src/hooks/`, `src/services/` |
