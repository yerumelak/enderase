import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationAM from "./locales/am/translation.json";
import translationEN from "./locales/en/translation.json";

const resources = {
  am: { translation: translationAM },
  en: { translation: translationEN },
};

const savedLang = localStorage.getItem('app_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang, // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
