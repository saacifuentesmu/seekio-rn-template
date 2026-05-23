// react-native-ble-plx implementation of the DevicePairing port.
//
// This is the only file allowed to import react-native-ble-plx. It owns the
// singleton `BleManager` lifecycle that used to live in services/ble/bleManager.
// All calls into the library happen here; the rest of the app sees only the
// neutral `PairedDevice` DTO.

import {BleManager, Device, State, Subscription} from 'react-native-ble-plx';

import {
  DevicePairing,
  DevicePairingSubscription,
  PairedDevice,
} from '@/services/backend/ports/devicePairing';

function toPairedDevice(d: Device): PairedDevice {
  return {
    id: d.id,
    name: d.name ?? d.localName ?? null,
    rssi: d.rssi ?? null,
    serviceUUIDs: d.serviceUUIDs ?? null,
    manufacturerData: d.manufacturerData ?? null,
    txPowerLevel: d.txPowerLevel ?? null,
    isConnectable: d.isConnectable ?? null,
  };
}

export class BlePlxDevicePairing implements DevicePairing {
  // Singleton inside the adapter — preserves the original
  // `getBleManager()` / `destroyBleManager()` lifecycle from services/ble.
  private manager: BleManager | null = null;

  private getManager(): BleManager {
    if (!this.manager) this.manager = new BleManager();
    return this.manager;
  }

  // Resolves once the central manager reports PoweredOn. Calling
  // startDeviceScan before the manager is ready yields the unhelpful
  // "Unknown error occurred" BleError on iOS.
  private async waitForPoweredOn(manager: BleManager): Promise<void> {
    const current = await manager.state();
    if (current === State.PoweredOn) return;
    await new Promise<void>((resolve, reject) => {
      const sub = manager.onStateChange(state => {
        if (state === State.PoweredOn) {
          sub.remove();
          resolve();
        } else if (
          state === State.Unsupported ||
          state === State.Unauthorized
        ) {
          sub.remove();
          reject(new Error(`Bluetooth ${state}`));
        }
      }, true);
    });
  }

  startScan(
    serviceUuids: string[] | null,
    onEvent: (error: Error | null, device: PairedDevice | null) => void,
  ): void {
    const manager = this.getManager();
    this.waitForPoweredOn(manager)
      .then(() => {
        manager.startDeviceScan(serviceUuids, null, (err, device) => {
          onEvent(err ?? null, device ? toPairedDevice(device) : null);
        });
      })
      .catch(err => onEvent(err as Error, null));
  }

  stopScan(): void {
    this.getManager().stopDeviceScan();
  }

  async connect(deviceId: string): Promise<PairedDevice> {
    const d = await this.getManager().connectToDevice(deviceId);
    await d.discoverAllServicesAndCharacteristics();
    return toPairedDevice(d);
  }

  async disconnect(deviceId: string): Promise<void> {
    await this.getManager().cancelDeviceConnection(deviceId);
  }

  monitorCharacteristic(
    deviceId: string,
    serviceUuid: string,
    characteristicUuid: string,
    onValue: (value: string) => void,
    onError?: (error: Error) => void,
  ): DevicePairingSubscription {
    const sub: Subscription = this.getManager().monitorCharacteristicForDevice(
      deviceId,
      serviceUuid,
      characteristicUuid,
      (err, ch) => {
        if (err) {
          onError?.(err);
          return;
        }
        if (ch?.value) onValue(ch.value);
      },
    );
    return {remove: () => sub.remove()};
  }

  destroy(): void {
    this.manager?.destroy();
    this.manager = null;
  }
}
