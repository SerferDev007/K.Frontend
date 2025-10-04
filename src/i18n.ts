import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import EnTranslation from "./Languages/EnTranslation.json";
import MrTranslation from "./Languages/MrTranslation.json";

i18n
  .use(LanguageDetector) // auto-detects browser language
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false, // react already escapes
    },
    resources: {
      en: { translation: EnTranslation },
      mr: { translation: MrTranslation },
    },
  });

export default i18n;
