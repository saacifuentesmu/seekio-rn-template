import {useCallback, useEffect, useState} from 'react';

import {appConfig} from '@/constants/appConfig';
import {usePermissions} from '@/hooks/permissions/usePermissions';
import {getDevicePairing} from '@/services/backend';
import {PairedDevice} from '@/services/backend/ports/devicePairing';
import {logger} from '@/utils/logger';

export function useBleScan() {
  const {ensure} = usePermissions();
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<PairedDevice[]>([]);
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
    const pairing = getDevicePairing();
    const filter = appConfig.bleServiceUuids.length
      ? appConfig.bleServiceUuids
      : null;
    pairing.startScan(filter, (err, device) => {
      if (err) {
        // ble-plx wraps the native cause in `reason` and exposes platform error
        // codes. `err.message` alone is the generic "Unknown error" string.
        const detail = (err as unknown as Record<string, unknown>) ?? {};
        logger.warn('scan error', {
          message: err.message,
          reason: detail.reason,
          errorCode: detail.errorCode,
          iosErrorCode: detail.iosErrorCode,
          androidErrorCode: detail.androidErrorCode,
        });
        setError(
          typeof detail.reason === 'string' ? detail.reason : err.message,
        );
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
    getDevicePairing().stopScan();
    setScanning(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  return {scanning, devices, error, start, stop};
}
