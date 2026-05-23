import notifee, {AndroidImportance} from '@notifee/react-native';

import {logger} from '@/utils/logger';

import {PushMessage, PushService} from './pushService';

const CHANNEL_ID = 'default';

async function ensureChannel(): Promise<string> {
  return notifee.createChannel({id: CHANNEL_ID, name: 'Default', importance: AndroidImportance.HIGH});
}

// Notifee handles local notifications. For FCM delivery, install
// @react-native-firebase/app + @react-native-firebase/messaging, drop in
// google-services.json / GoogleService-Info.plist, and wire messaging() into
// getToken() and onMessage() below (see README "Enabling FCM").
export const notifeeService: PushService = {
  async init() {
    try {
      await ensureChannel();
      await notifee.requestPermission();
    } catch (e) {
      logger.warn('push init failed', e);
    }
  },

  async getToken() {
    return null;
  },

  onMessage(_cb: (msg: PushMessage) => void) {
    return () => {};
  },
};
