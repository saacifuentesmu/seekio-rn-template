import {useCallback, useEffect, useRef, useState} from 'react';
import {Device, Subscription} from 'react-native-ble-plx';

import {getBleManager} from '@/services/ble/bleManager';
import {logger} from '@/utils/logger';

interface MonitorArgs {
  serviceUuid: string;
  characteristicUuid: string;
}

export function useBleDevice(deviceId: string | null) {
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const monitorRef = useRef<Subscription | null>(null);

  const connect = useCallback(async () => {
    if (!deviceId) return;
    try {
      const manager = getBleManager();
      const d = await manager.connectToDevice(deviceId);
      await d.discoverAllServicesAndCharacteristics();
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
      await device.cancelConnection();
    } finally {
      setConnected(false);
    }
  }, [device]);

  const monitor = useCallback(
    ({serviceUuid, characteristicUuid}: MonitorArgs, onValue: (base64: string) => void) => {
      if (!device) return () => {};
      const sub = device.monitorCharacteristicForService(serviceUuid, characteristicUuid, (err, ch) => {
        if (err) {
          logger.warn('monitor err', err);
          return;
        }
        if (ch?.value) onValue(ch.value);
      });
      monitorRef.current = sub;
      return () => sub.remove();
    },
    [device],
  );

  useEffect(() => () => {
    monitorRef.current?.remove();
  }, []);

  return {device, connected, error, connect, disconnect, monitor};
}
