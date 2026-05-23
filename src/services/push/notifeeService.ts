import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import {logger} from '@/utils/logger';

import {PushMessage, PushService} from './pushService';

const CHANNEL_ID = 'default';

async function ensureChannel(): Promise<string> {
  return notifee.createChannel({id: CHANNEL_ID, name: 'Default', importance: AndroidImportance.HIGH});
}

export const notifeeService: PushService = {
  async init() {
    try {
      await ensureChannel();
      await messaging().requestPermission();
    } catch (e) {
      logger.warn('push init failed', e);
    }
  },

  async getToken() {
    try {
      const token = await messaging().getToken();
      return token ?? null;
    } catch (e) {
      logger.warn('getToken failed', e);
      return null;
    }
  },

  onMessage(cb: (msg: PushMessage) => void) {
    const unsub = messaging().onMessage(async remote => {
      const msg: PushMessage = {
        title: remote.notification?.title,
        body: remote.notification?.body,
        data: remote.data as Record<string, string> | undefined,
      };
      cb(msg);
      await notifee.displayNotification({
        title: msg.title,
        body: msg.body,
        android: {channelId: CHANNEL_ID},
      });
    });
    return unsub;
  },
};
