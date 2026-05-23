import {useCallback, useEffect, useState} from 'react';
import {Device} from 'react-native-ble-plx';

import {appConfig} from '@/constants/appConfig';
import {usePermissions} from '@/hooks/permissions/usePermissions';
import {getBleManager} from '@/services/ble/bleManager';
import {logger} from '@/utils/logger';

export function useBleScan() {
  const {ensure} = usePermissions();
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    const okBt = await ensure('bluetooth');
    const okLoc = await ensure('location');
    if (!okBt || !okLoc) {
      setError('Permissions denied');
      return;
    }
    setError(null);
    setDevices([]);
    setScanning(true);
    const manager = getBleManager();
    const filter = appConfig.bleServiceUuids.length
      ? appConfig.bleServiceUuids
      : null;
    manager.startDeviceScan(filter, null, (err, device) => {
      if (err) {
        logger.warn('scan error', err);
        setError(err.message);
        setScanning(false);
        return;
      }
      if (!device) return;
      setDevices(prev =>
        prev.some(d => d.id === device.id) ? prev : [...prev, device],
      );
    });
  }, [ensure]);

  const stop = useCallback(() => {
    getBleManager().stopDeviceScan();
    setScanning(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return {scanning, devices, error, start, stop};
}
