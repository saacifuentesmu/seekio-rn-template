// Backend-neutral cloud file contract (a "port" in ports-and-adapters).
//
// Screens and hooks depend on THIS interface, never on a vendor SDK. Each
// backend (REST, Firebase Storage, S3, ...) ships an adapter that implements
// it. Swapping backends = swapping the adapter selected in
// services/backend/index.ts, with no change to consumers.
//
// MUST NOT import any vendor SDK.
//
// DTO convention: all values crossing this boundary are NEUTRAL — paths are
// strings, timestamps are ISO 8601 strings (never `Date`), file content is a
// string for CSV. Adapters map their native shape to/from these types.

export interface FileStore {
  /** Upload CSV text to the given store-relative path. Overwrites if present. */
  uploadCsv(path: string, content: string): Promise<void>;

  /** Download CSV text from the given path. Resolves to null if missing. */
  downloadCsv(path: string): Promise<string | null>;

  /** Returns ISO 8601 string, or null if the file doesn't exist. */
  getFileUpdatedTime(path: string): Promise<string | null>;
}
