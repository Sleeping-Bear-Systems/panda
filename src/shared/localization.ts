import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { appConfig } from "./config";
import de from "./locales/de.json";
import es from "./locales/es.json";

i18next.use(LanguageDetector).init({
  supportedLngs: ["de", "es"],
  lng: "es",
  fallbackLng: "en",
  debug: appConfig.NODE_ENV == "development",
  resources: {
    es: {
      translation: es,
    },
    de: {
      translation: de,
    },
  },
});
