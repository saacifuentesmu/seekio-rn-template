import Geolocation, {GeoPosition} from '@react-native-community/geolocation';
import {useCallback, useEffect, useState} from 'react';

import {usePermissions} from '@/hooks/permissions/usePermissions';
import {logger} from '@/utils/logger';

export function useLocation(watch = false) {
  const {ensure} = usePermissions();
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrent = useCallback(async () => {
    const ok = await ensure('location');
    if (!ok) {
      setError('Location permission denied');
      return null;
    }
    return new Promise<GeoPosition | null>(resolve => {
      Geolocation.getCurrentPosition(
        pos => {
          setPosition(pos);
          resolve(pos);
        },
        err => {
          logger.warn('location error', err);
          setError(err.message);
          resolve(null);
        },
      );
    });
  }, [ensure]);

  useEffect(() => {
    if (!watch) return;
    let watchId: number | null = null;
    (async () => {
      const ok = await ensure('location');
      if (!ok) return;
      watchId = Geolocation.watchPosition(pos => setPosition(pos), err => setError(err.message));
    })();
    return () => {
      if (watchId != null) Geolocation.clearWatch(watchId);
    };
  }, [watch, ensure]);

  return {position, error, getCurrent};
}
