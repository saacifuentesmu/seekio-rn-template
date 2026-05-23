import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import {appConfig} from '@/constants/appConfig';
import AsyncStorage from '@/services/storage/asyncStorage';
import {PaletteName} from '@/theme/palette';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  locale: string;
  themeMode: ThemeMode;
  paletteName: PaletteName;
  setLocale: (locale: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setPaletteName: (name: PaletteName) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      locale: appConfig.defaultLocale,
      themeMode: 'system',
      paletteName: 'default',
      setLocale: locale => set({locale}),
      setThemeMode: themeMode => set({themeMode}),
      setPaletteName: paletteName => set({paletteName}),
    }),
    {
      name: 'seekio.settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        locale: state.locale,
        themeMode: state.themeMode,
        paletteName: state.paletteName,
      }),
    },
  ),
);
