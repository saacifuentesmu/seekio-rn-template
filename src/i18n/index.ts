import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import es from './locales/es.json';

import {appConfig} from '@/constants/appConfig';
import {useSettingsStore} from '@/store/settingsStore';

const resources = {
  en: {translation: en},
  es: {translation: es},
} as const;

function osLocale(): string {
  const best = RNLocalize.findBestLanguageTag(appConfig.supportedLocales);
  return best?.languageTag ?? appConfig.defaultLocale;
}

function resolveLocale(): string {
  const stored = useSettingsStore.getState().locale;
  return stored ?? osLocale();
}

export function initI18n(): void {
  if (i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    resources,
    lng: resolveLocale(),
    fallbackLng: appConfig.defaultLocale,
    load: 'languageOnly',
    interpolation: {escapeValue: false},
    // v3 avoids the Intl.PluralRules requirement Hermes can't fully satisfy.
    compatibilityJSON: 'v3',
  });

  // The persisted locale rehydrates asynchronously; re-apply once it lands,
  // and follow any later changes from setLocale.
  useSettingsStore.subscribe(state => {
    const next = state.locale ?? osLocale();
    if (i18n.language !== next) i18n.changeLanguage(next);
  });
}

export default i18n;
