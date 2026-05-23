// Firebase implementation of the DataStore port.
//
// Generic CRUD over Firestore collections. The `resource` string is used
// directly as the collection name. Every value crossing the port is a NEUTRAL
// DTO: the Firestore doc id is merged into the data as `id`, and Firestore
// `Timestamp` fields are converted to ISO 8601 strings before returning.
//
// list() supports EQUALITY filters only: each [key, value] in `query` becomes a
// `.where(key, '==', value)`. Ranges, ordering and limits are out of scope.
//
// Native-setup prerequisites (handled outside this file — see report/README):
//   - @react-native-firebase/app + firestore installed and autolinked.
//   - android/app/google-services.json present and the Google Services gradle
//     plugin applied; iOS GoogleService-Info.plist present.

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import {DataStore} from '@/services/backend/ports/dataStore';

function isTimestamp(v: unknown): v is FirebaseFirestoreTypes.Timestamp {
  return (
    !!v &&
    typeof v === 'object' &&
    typeof (v as {toDate?: unknown}).toDate === 'function'
  );
}

/** Merge the doc id into the data and convert Timestamp fields to ISO strings. */
function fromDoc<T>(snap: FirebaseFirestoreTypes.DocumentSnapshot): T {
  const data = snap.data() ?? {};
  const out: Record<string, unknown> = {id: snap.id};
  for (const [k, v] of Object.entries(data)) {
    out[k] = isTimestamp(v) ? v.toDate().toISOString() : v;
  }
  return out as T;
}

export class FirebaseDataStore implements DataStore {
  async get<T>(resource: string, id: string): Promise<T | null> {
    const snap = await firestore().collection(resource).doc(id).get();
    if (!snap.exists) return null;
    return fromDoc<T>(snap);
  }

  async list<T>(
    resource: string,
    query?: Record<string, unknown>,
  ): Promise<T[]> {
    let ref: FirebaseFirestoreTypes.Query = firestore().collection(resource);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        ref = ref.where(key, '==', value);
      }
    }
    const snap = await ref.get();
    return snap.docs.map(doc => fromDoc<T>(doc));
  }

  async create<T>(resource: string, data: Partial<T>): Promise<T> {
    // Firestore generates the id; drop any incoming `id` so it isn't stored as
    // a field (the id lives outside the doc data, merged back in by fromDoc).
    const payload: Record<string, unknown> = {...data};
    delete payload.id;
    const docRef = await firestore().collection(resource).add(payload);
    // Re-fetch to pick up server-resolved timestamps (serverTimestamp, etc.).
    const snap = await docRef.get();
    return fromDoc<T>(snap);
  }

  async update<T>(resource: string, id: string, data: Partial<T>): Promise<T> {
    const docRef = firestore().collection(resource).doc(id);
    await docRef.update(data as {[key: string]: unknown});
    const snap = await docRef.get();
    return fromDoc<T>(snap);
  }

  async delete(resource: string, id: string): Promise<void> {
    await firestore().collection(resource).doc(id).delete();
  }
}
