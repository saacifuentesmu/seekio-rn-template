import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import {appConfig} from '@/constants/appConfig';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: {translation: en},
  es: {translation: es},
} as const;

function pickLocale(): string {
  const best = RNLocalize.findBestLanguageTag(appConfig.supportedLocales);
  return best?.languageTag ?? appConfig.defaultLocale;
}

export function initI18n(): void {
  if (i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: pickLocale(),
      fallbackLng: appConfig.defaultLocale,
      interpolation: {escapeValue: false},
      compatibilityJSON: 'v4',
    });
}

export default i18n;
