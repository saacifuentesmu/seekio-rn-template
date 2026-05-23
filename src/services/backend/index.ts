// Composition root: selects backend adapters from appConfig and exposes them to
// consumers as the port interface. This is the ONLY place that knows which
// concrete backend is wired. Hooks/screens call getAuthProvider() (and the
// other get*() selectors) and depend on the port interface, never on a
// specific adapter.

import {appConfig} from '@/constants/appConfig';
import {AuthProvider} from '@/services/backend/ports/authProvider';
import {DataStore} from '@/services/backend/ports/dataStore';
import {FileStore} from '@/services/backend/ports/fileStore';
import {DevicePairing} from '@/services/backend/ports/devicePairing';
import {RestAuthProvider} from '@/services/backend/adapters/restAuthProvider';
import {FirebaseAuthProvider} from '@/services/backend/adapters/firebaseAuthProvider';
import {RestDataStore} from '@/services/backend/adapters/restDataStore';
import {FirebaseDataStore} from '@/services/backend/adapters/firebaseDataStore';
import {RestFileStore} from '@/services/backend/adapters/restFileStore';
import {FirebaseFileStore} from '@/services/backend/adapters/firebaseFileStore';
import {BlePlxDevicePairing} from '@/services/backend/adapters/blePlxDevicePairing';
import {NoopDevicePairing} from '@/services/backend/adapters/noopDevicePairing';

let authInstance: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (!authInstance) {
    authInstance =
      appConfig.backend.auth === 'firebase'
        ? new FirebaseAuthProvider()
        : new RestAuthProvider();
  }
  return authInstance;
}

/** Hook form for idiomatic use inside components/hooks. */
export function useAuthProvider(): AuthProvider {
  return getAuthProvider();
}

let dataInstance: DataStore | null = null;

export function getDataStore(): DataStore {
  if (!dataInstance) {
    dataInstance =
      appConfig.backend.data === 'firebase'
        ? new FirebaseDataStore()
        : new RestDataStore();
  }
  return dataInstance;
}

/** Hook form for idiomatic use inside components/hooks. */
export function useDataStore(): DataStore {
  return getDataStore();
}

let fileInstance: FileStore | null = null;

export function getFileStore(): FileStore {
  if (!fileInstance) {
    fileInstance =
      appConfig.backend.files === 'firebase'
        ? new FirebaseFileStore()
        : new RestFileStore();
  }
  return fileInstance;
}

/** Hook form for idiomatic use inside components/hooks. */
export function useFileStore(): FileStore {
  return getFileStore();
}

let pairingInstance: DevicePairing | null = null;

export function getDevicePairing(): DevicePairing {
  if (!pairingInstance) {
    pairingInstance =
      appConfig.featureFlags.ble === false
        ? new NoopDevicePairing()
        : new BlePlxDevicePairing();
  }
  return pairingInstance;
}

/** Hook form for idiomatic use inside components/hooks. */
export function useDevicePairing(): DevicePairing {
  return getDevicePairing();
}

export type {AuthProvider} from '@/services/backend/ports/authProvider';
export type {DataStore} from '@/services/backend/ports/dataStore';
export type {FileStore} from '@/services/backend/ports/fileStore';
export type {
  DevicePairing,
  DevicePairingSubscription,
  PairedDevice,
} from '@/services/backend/ports/devicePairing';
