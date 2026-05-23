import {useEffect, useState} from 'react';

import {getAuthProvider} from '@/services/backend';
import {useSessionStore} from '@/store/sessionStore';
import {logger} from '@/utils/logger';

type RestoreStatus = 'restoring' | 'ready';

export function useSessionRestore() {
  const [status, setStatus] = useState<RestoreStatus>('restoring');

  useEffect(() => {
    let cancelled = false;
    const auth = getAuthProvider();

    (async () => {
      try {
        const user = await auth.restoreSession();
        if (cancelled) return;
        if (user) {
          useSessionStore.getState().setSession(user);
          logger.info('[session-restore] session restored');
        }
      } catch (err) {
        logger.warn('[session-restore] restore failed:', err);
      } finally {
        if (!cancelled) setStatus('ready');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {status};
}
