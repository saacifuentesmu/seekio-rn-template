// Firebase implementation of the FileStore port — STUB.
//
// Exists to prove the port boundary holds: a second backend can be selected via
// appConfig.backend.files = 'firebase' without touching any consumer. To make
// it real:
//   1. yarn add @react-native-firebase/app @react-native-firebase/storage
//   2. Drop google-services.json / GoogleService-Info.plist into the native projects.
//   3. Implement each method against `storage().ref(path)` — putString for CSV
//      upload, getDownloadURL + fetch for download, getMetadata().updated for
//      the updated time (return as ISO 8601 string, not a Date).
//
// Kept as a pure stub (no firebase import) so the template compiles without the
// dependency installed.

import {FileStore} from '@/services/backend/ports/fileStore';

const NOT_IMPLEMENTED =
  'FirebaseFileStore not implemented — install @react-native-firebase/storage and implement (see file header)';

export class FirebaseFileStore implements FileStore {
  uploadCsv(_path: string, _content: string): Promise<void> {
    throw new Error(NOT_IMPLEMENTED);
  }

  downloadCsv(_path: string): Promise<string | null> {
    throw new Error(NOT_IMPLEMENTED);
  }

  getFileUpdatedTime(_path: string): Promise<string | null> {
    throw new Error(NOT_IMPLEMENTED);
  }
}
