import { cookies, headers } from "next/headers";
import {
  APP_LOCALES,
  DEFAULT_APP_LOCALE,
  LOCALE_COOKIE_NAME,
  type AppLocale,
} from "@/lib/i18n/config";

function normalizeLocale(value: string | null | undefined): AppLocale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace("_", "-");
  const match = APP_LOCALES.find(
    (locale) => normalized === locale || normalized.startsWith(`${locale}-`),
  );

  return match ?? null;
}

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  const preferredLocale = acceptLanguage?.split(",")[0];

  return normalizeLocale(preferredLocale) ?? DEFAULT_APP_LOCALE;
}
