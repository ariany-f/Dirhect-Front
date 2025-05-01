import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções
import enCommon from '@locales/en/common.json';
import ptCommon from '@locales/pt/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React já faz escape
    },
    resources: {
      en: {
        common: enCommon,
      },
      pt: {
        common: ptCommon,
      },
    },
  });

export default i18n;