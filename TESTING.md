# Testing the auth flow

The template ships without a real backend. This guide covers two debug paths: a local stub backend (covers the success path of any login) and Google Sign-In end-to-end (requires a real Google Cloud OAuth client, but no real backend).

## Local stub backend

A small Express stub with `/auth/login`, `/auth/register` (`{email, password} -> {user, accessToken, refreshToken}`), `/auth/google`, `/auth/refresh`, `POST /auth/forgot-password` (`{email} -> {ok: true}`, always succeeds), and `GET /me` (auth-required via `Authorization` header, returns `{user}`; 401 if missing) lives at `debug-server.js`. All endpoints return fake tokens and accept any non-empty input.

```bash
yarn install         # picks up express dev dep
yarn debug:server
```

Then point the app at it. Edit `src/constants/appConfig.ts`:

```ts
apiBaseUrls: {
  dev: 'http://10.0.2.2:3000',     // Android emulator: 10.0.2.2 maps to host's localhost
  // dev: 'http://localhost:3000',  // iOS simulator
  // dev: 'http://192.168.x.x:3000' // physical device on same wifi
  staging: '...',
  prod: '...',
},
```

`10.0.2.2` is the magic IP for accessing the host machine from the Android emulator — `localhost` inside the emulator means the emulator itself, not your dev box.

Rebuild (`yarn android:dev`) and sign in with any email + password. Metro should log:

```
[api] POST http://10.0.2.2:3000/auth/login   <no error>
```

and the debug-server terminal logs the request body.

## Google Sign-In

You need a real Google Cloud OAuth client. There's no offline/mock mode — the SDK contacts Google's servers and Google validates your app's package name + signing cert.

### One-time Google Cloud setup (~10 min, free, no card)

1. https://console.cloud.google.com/ → top-left project picker → **New Project** → name it (e.g. `seekio-rn-test`) → Create.

2. **APIs & Services → OAuth consent screen** (left nav):
   - User Type: **External** → Create.
   - App name, support email, developer contact email: yours.
   - Save and Continue past the Scopes screen (don't add any).
   - **Test users** → Add Users → add the Gmail you'll sign in with. App stays in "Testing" mode — only test users can sign in, but you don't need Google review.
   - Save.

3. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**:
   - **Web application** — name "RN Template Web". Leave both URI fields empty. Create. **Copy the Client ID** (looks like `123456789-abc.apps.googleusercontent.com`). This is your `webClientId`.

4. Same screen → **+ Create Credentials → OAuth client ID** again:
   - **Android**.
   - Package name: `io.seekio.rntemplate.dev` (the dev flavor's applicationId).
   - SHA-1 certificate fingerprint: get from `cd android && ./gradlew signingReport`. Find any debug variant section, copy the `SHA1:` line. Paste into the console. Create. (You don't paste this client's ID anywhere — registering it just authorises your app to use OAuth.)

5. (Repeat step 4 once each for the `staging` and `prod` package names when you need those flavors.)

### Wire into the app

```ts
// src/constants/appConfig.ts
googleSignIn: {
  webClientId: '123456789-abc.apps.googleusercontent.com', // from step 3
  iosClientId: '',
  offlineAccess: false,
},
```

Rebuild: `yarn android:dev`. The Google button now appears on the login screen. Tap it → Google account picker → pick your test-user Gmail → returns to app.

### What happens next

The app calls `loginWithGoogle(idToken)` which POSTs to `/auth/google`. With the **local stub backend** running, you'll get fake tokens and land in the app. With **no backend**, Metro shows `[api] POST .../auth/google failed: no-response Network Error`.

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| `apiClient is null - call configure first` | Google button tapped while `webClientId` is empty | The button hides itself when `webClientId` is empty — make sure you rebuilt after changing `appConfig`. |
| `DEVELOPER_ERROR` on Google button tap | SHA-1 or package name mismatch in the Android OAuth client | Re-check both. Note: changes can take ~5 min to propagate. |
| `PLAY_SERVICES_NOT_AVAILABLE` | Emulator lacks Google Play | Use a "Google Play" AVD image, not "Google APIs". |
| `Network Error` to `10.0.2.2:3000` | debug-server not running, or you're on iOS simulator (use `localhost`) | Start the server, or update `apiBaseUrls.dev` for your platform. |
| Email login silently does nothing | Form validation failing (empty fields, invalid email) | Validation errors don't currently surface visibly — check the field inputs. |
