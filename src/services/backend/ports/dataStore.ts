// Backend-neutral generic CRUD contract (a "port" in ports-and-adapters).
//
// Screens, hooks and the composition root depend on THIS interface, never on
// axios, Firebase, or any vendor SDK. Each backend (REST, Firebase, Cognito, ...)
// ships an adapter that implements it. Swapping backends = swapping the adapter
// selected in services/backend/index.ts, with no change to consumers.
//
// MUST NOT import axios or any vendor SDK.
//
// DTO convention: the generic `T` is always a NEUTRAL DTO — string IDs, ISO 8601
// date strings, plain objects, no vendor types. Adapters are responsible for
// mapping their native shape (Firestore `DocumentSnapshot`, axios payloads,
// `Date` objects, etc.) into and out of DTO shape across this boundary.

/**
 * Generic CRUD over named resources. Each resource is a collection of `T`
 * documents addressed by string id. Implementations MUST return / accept
 * NEUTRAL DTOs only (string ids, ISO date strings, plain objects).
 */
export interface DataStore {
  /** Fetch one document by id. Resolves to null when the document doesn't exist. */
  get<T>(resource: string, id: string): Promise<T | null>;

  /** List documents in a resource, optionally filtered by a query map. */
  list<T>(resource: string, query?: Record<string, unknown>): Promise<T[]>;

  /** Create a new document. Returns the created DTO (including server-assigned id). */
  create<T>(resource: string, data: Partial<T>): Promise<T>;

  /** Patch an existing document. Returns the updated DTO. */
  update<T>(resource: string, id: string, data: Partial<T>): Promise<T>;

  /** Delete a document by id. No-op if it doesn't exist is implementation-defined. */
  delete(resource: string, id: string): Promise<void>;
}
