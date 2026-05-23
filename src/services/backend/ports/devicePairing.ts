// Backend-neutral device-pairing contract (a "port" in ports-and-adapters).
//
// Screens and hooks depend on THIS interface, never on react-native-ble-plx
// or any other transport SDK. Each transport (BLE-plx, Web Bluetooth, a Noop
// shim, ...) ships an adapter that implements it. Swapping transports =
// swapping the adapter selected in services/backend/index.ts, with no change
// to consumers.
//
// MUST NOT import react-native-ble-plx or any vendor SDK.
//
// DTO convention: all types here are NEUTRAL. Device ids are strings, scan
// results are plain `PairedDevice` objects, characteristic values are base64
// strings. Adapters map their native shape (e.g. `Device` from
// react-native-ble-plx) into these neutral types at the boundary.

/** Neutral DTO for a discovered / connected device. */
export interface PairedDevice {
  /** Stable device id (MAC on Android, UUID on iOS). */
  id: string;
  /** Advertised local name, when available. */
  name: string | null;
  /** Received signal strength in dBm, when available. */
  rssi: number | null;
  /** Service UUIDs advertised by the peripheral. */
  serviceUUIDs: string[] | null;
  /** Manufacturer-specific advertisement payload (base64). */
  manufacturerData: string | null;
  /** Advertised transmit power level in dBm, when available. */
  txPowerLevel: number | null;
  /** Whether the peripheral indicates it accepts connections. */
  isConnectable: boolean | null;
}

/** Handle returned by subscription-style calls. Call `remove()` to unsubscribe. */
export interface DevicePairingSubscription {
  remove(): void;
}

export interface DevicePairing {
  /**
   * Begin scanning for devices. `serviceUuids` filters discovery; pass `null`
   * to scan for all advertising devices. The callback is invoked once per
   * discovered device (the same device may be reported multiple times — the
   * consumer dedupes by `id`). Errors during the scan are surfaced via the
   * `error` argument.
   */
  startScan(
    serviceUuids: string[] | null,
    onEvent: (error: Error | null, device: PairedDevice | null) => void,
  ): void;

  /** Stop an in-progress scan. Safe to call when not scanning. */
  stopScan(): void;

  /**
   * Connect to a device by id, discover all services & characteristics, and
   * resolve with the neutral device DTO.
   */
  connect(deviceId: string): Promise<PairedDevice>;

  /** Cancel an active connection. */
  disconnect(deviceId: string): Promise<void>;

  /**
   * Subscribe to notifications on a characteristic. The callback receives the
   * raw base64-encoded value. Returns a subscription whose `remove()` ends the
   * subscription.
   */
  monitorCharacteristic(
    deviceId: string,
    serviceUuid: string,
    characteristicUuid: string,
    onValue: (value: string) => void,
    onError?: (error: Error) => void,
  ): DevicePairingSubscription;

  /** Tear down underlying resources. Mirrors the old `destroyBleManager()`. */
  destroy(): void;
}
