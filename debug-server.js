// Local stub backend for testing the auth UI without a real server.
// Run with `yarn debug:server` (uses npx to fetch express on demand) or
// `node debug-server.js` if you already have express installed.
//
// Endpoints:
//   POST /auth/login    { email, password }   -> { user, accessToken, refreshToken }
//   POST /auth/google   { idToken }           -> { user, accessToken, refreshToken }
//   POST /auth/refresh  { refreshToken }      -> { accessToken, refreshToken }
//
// All endpoints return fake tokens. Login accepts any non-empty credentials.
// Set apiBaseUrls.dev in src/constants/appConfig.ts to:
//   - http://10.0.2.2:3000   (Android emulator)
//   - http://localhost:3000  (iOS simulator)
//   - http://<your-LAN-IP>:3000  (physical device on same wifi)

const express = require('express');

const app = express();
app.use(express.json());

const FAKE_USER = {id: 'debug-user-1', email: 'debug@example.com', name: 'Debug User'};
const fakeTokens = () => ({
  accessToken: `fake-access-${Date.now()}`,
  refreshToken: `fake-refresh-${Date.now()}`,
});

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.body);
  next();
});

app.post('/auth/login', (req, res) => {
  const {email, password} = req.body || {};
  if (!email || !password) return res.status(400).json({error: 'email and password required'});
  res.json({user: {...FAKE_USER, email}, ...fakeTokens()});
});

app.post('/auth/google', (req, res) => {
  const {idToken} = req.body || {};
  if (!idToken) return res.status(400).json({error: 'idToken required'});
  res.json({user: FAKE_USER, ...fakeTokens()});
});

app.post('/auth/refresh', (req, res) => {
  const {refreshToken} = req.body || {};
  if (!refreshToken) return res.status(400).json({error: 'refreshToken required'});
  res.json(fakeTokens());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`debug-server listening on http://localhost:${PORT}`);
  console.log('Set appConfig.apiBaseUrls.dev = "http://10.0.2.2:3000" for Android emulator.');
});
