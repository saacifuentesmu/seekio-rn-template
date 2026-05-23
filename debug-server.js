// Local stub backend for testing the auth UI without a real server.
// Run with `yarn debug:server` (uses npx to fetch express on demand) or
// `node debug-server.js` if you already have express installed.
//
// Endpoints:
//   POST /auth/login            { email, password }   -> { user, accessToken, refreshToken }
//   POST /auth/register         { email, password }   -> { user, accessToken, refreshToken }
//   POST /auth/google           { idToken }           -> { user, accessToken, refreshToken }
//   POST /auth/refresh          { refreshToken }      -> { accessToken, refreshToken }
//   POST /auth/forgot-password  { email }             -> { ok: true }
//   GET  /me                    (Authorization: Bearer ...) -> { user }
//
// Generic CRUD (matches the RestDataStore port contract — in-memory, resets on
// restart). `:resource` is any collection name, e.g. device_advertisements:
//   GET    /:resource           ?field=value   -> [ {id, ...}, ... ]  (equality filter)
//   GET    /:resource/:id                       -> {id, ...} | 404
//   POST   /:resource           { ... }         -> {id, ...}  (id auto-assigned)
//   PATCH  /:resource/:id       { ... }         -> {id, ...} | 404
//   DELETE /:resource/:id                        -> 204 | 404
//
// Tokens are structurally-valid unsigned JWTs (alg "none") with iat/exp claims,
// so the client's jwt-decode can read expiry. Not cryptographically signed.
// Login accepts any non-empty credentials.
// Set apiBaseUrls.dev in src/constants/appConfig.ts to:
//   - http://10.0.2.2:3000   (Android emulator)
//   - http://localhost:3000  (iOS simulator)
//   - http://<your-LAN-IP>:3000  (physical device on same wifi)

const express = require('express');

const app = express();
app.use(express.json());

const FAKE_USER = {
  id: 'debug-user-1',
  email: 'debug@example.com',
  name: 'Debug User',
};

const b64url = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');

// Mint a structurally-valid (unsigned) JWT so client-side jwt-decode can read
// the exp claim. The signature is a placeholder — this stub does not verify it.
const jwt = (claims, ttlSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({alg: 'none', typ: 'JWT'});
  const payload = b64url({...claims, iat: now, exp: now + ttlSeconds});
  return `${header}.${payload}.debug-signature`;
};

const fakeTokens = (sub = FAKE_USER.id) => ({
  accessToken: jwt({sub, type: 'access'}, 60 * 60), // 1h
  refreshToken: jwt({sub, type: 'refresh'}, 60 * 60 * 24 * 30), // 30d
});

app.use((req, _res, next) => {
  const hasQuery = Object.keys(req.query).length > 0;
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path}`,
    hasQuery ? {query: req.query} : req.body,
  );
  next();
});

app.post('/auth/login', (req, res) => {
  const {email, password} = req.body || {};
  if (!email || !password) {
    return res.status(400).json({error: 'email and password required'});
  }
  res.json({user: {...FAKE_USER, email}, ...fakeTokens()});
});

app.post('/auth/register', (req, res) => {
  const {email, password} = req.body || {};
  if (!email || !password) {
    return res.status(400).json({error: 'email and password required'});
  }
  res.json({user: {...FAKE_USER, email}, ...fakeTokens()});
});

app.post('/auth/google', (req, res) => {
  const {idToken} = req.body || {};
  if (!idToken) return res.status(400).json({error: 'idToken required'});
  res.json({user: FAKE_USER, ...fakeTokens()});
});

app.post('/auth/refresh', (req, res) => {
  const {refreshToken} = req.body || {};
  if (!refreshToken) {
    return res.status(400).json({error: 'refreshToken required'});
  }
  res.json(fakeTokens());
});

app.post('/auth/forgot-password', (req, res) => {
  const {email} = req.body || {};
  if (!email) return res.status(400).json({error: 'email required'});
  // Always return ok to avoid leaking which emails exist.
  res.json({ok: true});
});

app.get('/me', (req, res) => {
  const auth = req.header('Authorization');
  if (!auth || !auth.trim()) {
    return res.status(401).json({error: 'unauthorized'});
  }
  res.json({user: FAKE_USER});
});

// --- Generic in-memory CRUD (RestDataStore contract) ----------------------
// Reserved prefixes that are NOT generic collections.
const RESERVED = new Set(['auth', 'me']);

// collections[resource] = Map<id, doc>
const collections = {};
let nextId = 1;

const coll = resource => {
  if (!collections[resource]) collections[resource] = new Map();
  return collections[resource];
};

app.get('/:resource', (req, res, next) => {
  if (RESERVED.has(req.params.resource)) return next();
  const all = [...coll(req.params.resource).values()];
  const q = req.query || {};
  const filtered = all.filter(doc =>
    Object.entries(q).every(([k, v]) => String(doc[k]) === String(v)),
  );
  res.json(filtered);
});

app.get('/:resource/:id', (req, res, next) => {
  if (RESERVED.has(req.params.resource)) return next();
  const doc = coll(req.params.resource).get(req.params.id);
  if (!doc) return res.status(404).json({error: 'not found'});
  res.json(doc);
});

app.post('/:resource', (req, res, next) => {
  if (RESERVED.has(req.params.resource)) return next();
  const id = String(nextId++);
  const doc = {id, ...(req.body || {})};
  coll(req.params.resource).set(id, doc);
  res.status(201).json(doc);
});

app.patch('/:resource/:id', (req, res, next) => {
  if (RESERVED.has(req.params.resource)) return next();
  const c = coll(req.params.resource);
  const existing = c.get(req.params.id);
  if (!existing) return res.status(404).json({error: 'not found'});
  const updated = {...existing, ...(req.body || {}), id: existing.id};
  c.set(req.params.id, updated);
  res.json(updated);
});

app.delete('/:resource/:id', (req, res, next) => {
  if (RESERVED.has(req.params.resource)) return next();
  coll(req.params.resource).delete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`debug-server listening on port ${PORT} (all interfaces)`);
  console.log(`  Android emulator:    API_BASE_URL=http://10.0.2.2:${PORT}`);
  console.log(`  iOS simulator:       API_BASE_URL=http://localhost:${PORT}`);
  console.log(
    `  Physical device:     API_BASE_URL=http://<your-LAN-IP>:${PORT}  (same wifi)`,
  );
});
