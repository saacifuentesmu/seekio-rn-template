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

// Android 12+ splits Bluetooth into BLUETOOTH_SCAN + BLUETOOTH_CONNECT; both
// are required to discover and interact with peripherals. Callers ask for a
// single capability ('bluetooth') and we ensure every underlying permission.
function resolve(key: PermissionKey): Permission[] {
  if (key === 'location') {
    return [
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ];
  }
  if (key === 'bluetooth') {
    return Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.BLUETOOTH]
      : [
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        ];
  }
  if (key === 'notifications') {
    return Platform.OS === 'ios' ? [] : [PERMISSIONS.ANDROID.POST_NOTIFICATIONS];
  }
  return [];
}

export function usePermissions() {
  const [statuses, setStatuses] = useState<
    Partial<Record<PermissionKey, string>>
  >({});

  const ensure = useCallback(async (key: PermissionKey): Promise<boolean> => {
    const perms = resolve(key);
    if (perms.length === 0) return true;
    let allGranted = true;
    for (const perm of perms) {
      let result = await check(perm);
      if (result !== RESULTS.GRANTED) result = await request(perm);
      if (result !== RESULTS.GRANTED) allGranted = false;
    }
    setStatuses(prev => ({...prev, [key]: allGranted ? RESULTS.GRANTED : 'denied'}));
    return allGranted;
  }, []);

  return {statuses, ensure};
}
