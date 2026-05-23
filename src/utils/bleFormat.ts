// Display helpers for BLE advertisement payloads.

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Decodes a base64 string into a byte array. */
function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/[^A-Za-z0-9+/=]/g, '');
  const padded = clean.replace(/=+$/, '');
  const out = new Uint8Array((padded.length * 3) >> 2);
  let outIdx = 0;
  for (let i = 0; i < padded.length; i += 4) {
    const c0 = BASE64_CHARS.indexOf(padded[i]);
    const c1 = BASE64_CHARS.indexOf(padded[i + 1] ?? 'A');
    const c2 = BASE64_CHARS.indexOf(padded[i + 2] ?? 'A');
    const c3 = BASE64_CHARS.indexOf(padded[i + 3] ?? 'A');
    out[outIdx++] = (c0 << 2) | (c1 >> 4);
    if (i + 2 < padded.length) out[outIdx++] = ((c1 & 0xf) << 4) | (c2 >> 2);
    if (i + 3 < padded.length) out[outIdx++] = ((c2 & 0x3) << 6) | c3;
  }
  return out.slice(0, outIdx);
}

/** Renders bytes as space-separated uppercase hex (e.g. "4F A0 1C"). */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

/** Renders bytes as ASCII; non-printable bytes become '.'. */
export function bytesToAscii(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) {
    s += b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.';
  }
  return s;
}

/** Formats a base64 manufacturer-data blob as "hex\nASCII". */
export function formatManufacturerData(b64: string): string {
  const bytes = base64ToBytes(b64);
  if (bytes.length === 0) return '—';
  return `${bytesToHex(bytes)}\n${bytesToAscii(bytes)}`;
}

/** Normalises a BLE UUID to uppercase canonical form. */
export function formatUuid(uuid: string): string {
  return uuid.toUpperCase();
}
