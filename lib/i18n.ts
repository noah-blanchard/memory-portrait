"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import zhCommon from "@/locales/zh/common.json";

let initialized = false;

export function ensureI18n() {
  if (initialized) {
    return;
  }
  initialized = true;

  i18n
    .use(initReactI18next)
    .init({
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      resources: {
        en: { common: enCommon },
        zh: { common: zhCommon },
      },
    })
    .catch((e) => {
      console.error("i18n init error:", e);
    });
}

export default i18n;
