import {useEffect, useState} from 'react';

import {endSession, validateSession} from '@/services/auth/session';
import {getAccessToken} from '@/services/auth/tokens';
import {useSessionStore} from '@/store/sessionStore';
import {logger} from '@/utils/logger';

type RestoreStatus = 'restoring' | 'ready';

export function useSessionRestore() {
  const [status, setStatus] = useState<RestoreStatus>('restoring');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          logger.info('[session-restore] no token, skipping');
          return;
        }
        logger.info('[session-restore] token found, validating');
        const user = await validateSession();
        if (cancelled) return;
        useSessionStore.getState().setSession(user);
        logger.info('[session-restore] session restored');
      } catch (err) {
        logger.warn(
          '[session-restore] validation failed, clearing session:',
          err,
        );
        try {
          await endSession();
        } catch (clearErr) {
          logger.warn('[session-restore] endSession failed:', clearErr);
        }
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
