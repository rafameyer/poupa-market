export const APP_LOCALES = ["en", "pt", "es"] as const;
export const DEFAULT_APP_LOCALE = "en";
export const LOCALE_COOKIE_NAME = "poupa-market-locale";

export type AppLocale = (typeof APP_LOCALES)[number];
