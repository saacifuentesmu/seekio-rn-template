import {create} from 'zustand';

import {appConfig} from '@/constants/appConfig';

interface SettingsState {
  locale: string;
  themeMode: 'light' | 'dark' | 'system';
  setLocale: (locale: string) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
  locale: appConfig.defaultLocale,
  themeMode: 'system',
  setLocale: locale => set({locale}),
  setThemeMode: themeMode => set({themeMode}),
}));
