import {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

export type PermissionKey = 'bluetooth' | 'location' | 'notifications';

function resolve(key: PermissionKey): Permission | null {
  if (key === 'location') {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  }
  if (key === 'bluetooth') {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.BLUETOOTH
      : PERMISSIONS.ANDROID.BLUETOOTH_SCAN;
  }
  if (key === 'notifications') {
    return Platform.OS === 'ios'
      ? null
      : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
  }
  return null;
}

export function usePermissions() {
  const [statuses, setStatuses] = useState<
    Partial<Record<PermissionKey, string>>
  >({});

  const ensure = useCallback(async (key: PermissionKey): Promise<boolean> => {
    const perm = resolve(key);
    if (!perm) return true;
    let result = await check(perm);
    if (result !== RESULTS.GRANTED) result = await request(perm);
    setStatuses(prev => ({...prev, [key]: result}));
    return result === RESULTS.GRANTED;
  }, []);

  return {statuses, ensure};
}
