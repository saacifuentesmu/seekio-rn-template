import {useCallback, useState} from 'react';

import {getDataStore} from '@/services/backend';
import {PairedDevice} from '@/services/backend/ports/devicePairing';
import {logger} from '@/utils/logger';

const RESOURCE = 'device_advertisements';

// Neutral DTO persisted through the active DataStore backend (REST or Firebase).
// Flat, ISO-string dates, string id — same shape regardless of which adapter
// is selected in appConfig.backend.data.
export interface AdvertisementRecord {
  id: string;
  deviceId: string;
  name: string | null;
  rssi: number | null;
  serviceUUIDs: string[] | null;
  manufacturerData: string | null;
  txPowerLevel: number | null;
  capturedAt: string;
}

export function useDeviceAdvertisements(deviceId: string) {
  const [records, setRecords] = useState<AdvertisementRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const data = await getDataStore().list<AdvertisementRecord>(RESOURCE, {
        deviceId,
      });
      setRecords(data);
    } catch (err) {
      logger.warn('load advertisements failed', err);
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
  }, [deviceId]);

  const save = useCallback(
    async (device: PairedDevice) => {
      setSaving(true);
      setError(null);
      try {
        await getDataStore().create<AdvertisementRecord>(RESOURCE, {
          deviceId: device.id,
          name: device.name,
          rssi: device.rssi,
          serviceUUIDs: device.serviceUUIDs,
          manufacturerData: device.manufacturerData,
          txPowerLevel: device.txPowerLevel,
          capturedAt: new Date().toISOString(),
        });
        await refresh();
      } catch (err) {
        logger.warn('save advertisement failed', err);
        setError(err instanceof Error ? err.message : 'Failed to save');
      } finally {
        setSaving(false);
      }
    },
    [refresh],
  );

  return {records, saving, error, save, refresh};
}
