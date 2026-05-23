// Firebase implementation of the FileStore port.
//
// Reads/writes CSV text against Firebase Cloud Storage. The `path` is used
// directly as the storage ref path. All values crossing the port are NEUTRAL:
// CSV is a plain string, timestamps are ISO 8601 strings. A missing object is
// reported as null (never an error) — Storage signals this with the error code
// 'storage/object-not-found', which is caught here.
//
// Native-setup prerequisites (handled outside this file — see report/README):
//   - @react-native-firebase/app + storage installed and autolinked.
//   - android/app/google-services.json present and the Google Services gradle
//     plugin applied; iOS GoogleService-Info.plist present.
//   - A Cloud Storage bucket enabled on the Firebase project.

import storage from '@react-native-firebase/storage';

import {FileStore} from '@/services/backend/ports/fileStore';

const OBJECT_NOT_FOUND = 'storage/object-not-found';

function isNotFound(err: unknown): boolean {
  return (err as {code?: string}).code === OBJECT_NOT_FOUND;
}

export class FirebaseFileStore implements FileStore {
  async uploadCsv(path: string, content: string): Promise<void> {
    await storage()
      .ref(path)
      .putString(content, 'raw', {contentType: 'text/csv'});
  }

  async downloadCsv(path: string): Promise<string | null> {
    let url: string;
    try {
      url = await storage().ref(path).getDownloadURL();
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
    const res = await fetch(url);
    return res.text();
  }

  async getFileUpdatedTime(path: string): Promise<string | null> {
    try {
      const meta = await storage().ref(path).getMetadata();
      // RNFirebase already exposes `updated` as an ISO 8601 string.
      return meta.updated ?? null;
    } catch (err) {
      if (isNotFound(err)) return null;
      throw err;
    }
  }
}
