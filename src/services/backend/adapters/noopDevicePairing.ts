// No-op implementation of the DevicePairing port.
//
// Selected by the composition root when `appConfig.featureFlags.ble === false`.
// Every method THROWS rather than silently returning — if BLE is disabled at
// the feature-flag level, calling a pairing method is a bug in the caller
// (a hook or screen running when it shouldn't). Throwing surfaces that bug
// loudly instead of producing a confusing silent no-op.

import {
  DevicePairing,
  DevicePairingSubscription,
  PairedDevice,
} from '@/services/backend/ports/devicePairing';

const DISABLED = 'DevicePairing: BLE disabled — set featureFlags.ble = true';

export class NoopDevicePairing implements DevicePairing {
  startScan(
    _serviceUuids: string[] | null,
    _onEvent: (error: Error | null, device: PairedDevice | null) => void,
  ): void {
    throw new Error(DISABLED);
  }

  stopScan(): void {
    throw new Error(DISABLED);
  }

  connect(_deviceId: string): Promise<PairedDevice> {
    throw new Error(DISABLED);
  }

  disconnect(_deviceId: string): Promise<void> {
    throw new Error(DISABLED);
  }

  monitorCharacteristic(
    _deviceId: string,
    _serviceUuid: string,
    _characteristicUuid: string,
    _onValue: (value: string) => void,
    _onError?: (error: Error) => void,
  ): DevicePairingSubscription {
    throw new Error(DISABLED);
  }

  destroy(): void {
    throw new Error(DISABLED);
  }
}
