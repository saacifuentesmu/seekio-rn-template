import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

import AsyncStorage from '@/services/storage/asyncStorage';
import {PaletteName} from '@/theme/palette';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  // null = follow OS locale; a string = explicit user choice.
  locale: string | null;
  themeMode: ThemeMode;
  paletteName: PaletteName;
  setLocale: (locale: string | null) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setPaletteName: (name: PaletteName) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      locale: null,
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
