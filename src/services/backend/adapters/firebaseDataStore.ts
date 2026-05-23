// Firebase implementation of the DataStore port — STUB.
//
// Exists to prove the port boundary holds: a second backend can be selected via
// appConfig.backend.data = 'firebase' without touching any consumer. To make it
// real:
//   1. yarn add @react-native-firebase/app @react-native-firebase/firestore
//   2. Drop google-services.json / GoogleService-Info.plist into the native projects.
//   3. Implement each method against `firestore()` (collection/doc/get/set/update/
//      delete), mapping Firestore `DocumentSnapshot` data + Timestamp fields into
//      the neutral DTO shape (string ids, ISO date strings) before returning.
//
// Kept as a pure stub (no firebase import) so the template compiles without the
// dependency installed.

import {DataStore} from '@/services/backend/ports/dataStore';

const NOT_IMPLEMENTED =
  'FirebaseDataStore not implemented — install @react-native-firebase/firestore and implement (see file header)';

export class FirebaseDataStore implements DataStore {
  get<T>(_resource: string, _id: string): Promise<T | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  list<T>(_resource: string, _query?: Record<string, unknown>): Promise<T[]> {
    throw new Error(NOT_IMPLEMENTED);
  }

  create<T>(_resource: string, _data: Partial<T>): Promise<T> {
    throw new Error(NOT_IMPLEMENTED);
  }

  update<T>(_resource: string, _id: string, _data: Partial<T>): Promise<T> {
    throw new Error(NOT_IMPLEMENTED);
  }

  delete(_resource: string, _id: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
