import {useCallback, useEffect, useRef, useState} from 'react';

import {getDevicePairing} from '@/services/backend';
import {
  DevicePairingSubscription,
  PairedDevice,
} from '@/services/backend/ports/devicePairing';
import {logger} from '@/utils/logger';

interface MonitorArgs {
  serviceUuid: string;
  characteristicUuid: string;
}

export function useBleDevice(deviceId: string | null) {
  const [device, setDevice] = useState<PairedDevice | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const monitorRef = useRef<DevicePairingSubscription | null>(null);

  const connect = useCallback(async () => {
    if (!deviceId) return;
    try {
      const pairing = getDevicePairing();
      const d = await pairing.connect(deviceId);
      setDevice(d);
      setConnected(true);
    } catch (e) {
      logger.warn('ble connect failed', e);
      setError((e as Error).message);
    }
  }, [deviceId]);

  const disconnect = useCallback(async () => {
    if (!device) return;
    try {
      monitorRef.current?.remove();
      monitorRef.current = null;
      await getDevicePairing().disconnect(device.id);
    } finally {
      setConnected(false);
    }
  }, [device]);

  const monitor = useCallback(
    (
      {serviceUuid, characteristicUuid}: MonitorArgs,
      onValue: (base64: string) => void,
    ) => {
      if (!device) return () => {};
      const sub = getDevicePairing().monitorCharacteristic(
        device.id,
        serviceUuid,
        characteristicUuid,
        onValue,
        err => {
          logger.warn('monitor err', err);
        },
      );
      monitorRef.current = sub;
      return () => sub.remove();
    },
    [device],
  );

  useEffect(
    () => () => {
      monitorRef.current?.remove();
    },
    [],
  );

  return {device, connected, error, connect, disconnect, monitor};
}
