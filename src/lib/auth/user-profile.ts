import type { User } from "@supabase/supabase-js";
import { APP_ROUTES } from "@/constants/app";

type UserLike = Pick<User, "email" | "user_metadata"> | null | undefined;
type MetadataRecord = Record<string, unknown>;

export interface UserProfileDraft {
  fullName: string;
  email: string;
  age: string;
  country: string;
  avatarUrl?: string;
}

function getMetadata(user: UserLike): MetadataRecord {
  if (!user?.user_metadata || typeof user.user_metadata !== "object") {
    return {};
  }

  return user.user_metadata as MetadataRecord;
}

function readString(metadata: MetadataRecord, key: string) {
  const value = metadata[key];
  return typeof value === "string" ? value.trim() : "";
}

function readNumberString(metadata: MetadataRecord, key: string) {
  const value = metadata[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }

  if (typeof value === "string" && /^\d{1,3}$/.test(value.trim())) {
    return value.trim();
  }

  return "";
}

function calculateAgeFromBirthdate(birthdate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthdate);

  if (!match) {
    return "";
  }

  const [year, month, day] = match.slice(1).map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const hasBirthdayPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
}

function getLocaleRegion(locale: string) {
  const normalized = locale.replaceAll("_", "-");

  try {
    const intlLocale = new Intl.Locale(normalized);
    return intlLocale.region ?? intlLocale.maximize().region ?? "";
  } catch {
    const match = normalized.match(/-([A-Za-z]{2})\b/);
    return match ? match[1].toUpperCase() : "";
  }
}

export function inferCountryFromLocale(locale: string) {
  const region = getLocaleRegion(locale);

  if (!region) {
    return "";
  }

  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(region) ?? region;
  } catch {
    return region;
  }
}

export function getUserProfileDraft(user: UserLike): UserProfileDraft {
  const metadata = getMetadata(user);
  const fullName =
    readString(metadata, "full_name") ||
    readString(metadata, "name") ||
    [readString(metadata, "given_name"), readString(metadata, "family_name")]
      .filter(Boolean)
      .join(" ") ||
    "";
  const age =
    readNumberString(metadata, "age") ||
    calculateAgeFromBirthdate(readString(metadata, "birthdate"));
  const country =
    readString(metadata, "country") ||
    inferCountryFromLocale(readString(metadata, "locale"));
  const avatarUrl =
    readString(metadata, "avatar_url") || readString(metadata, "picture") || undefined;

  return {
    fullName,
    email: user?.email?.trim() ?? "",
    age,
    country,
    avatarUrl,
  };
}

export function getUserMetadata(user: UserLike) {
  return getMetadata(user);
}

export function hasCompletedRegistration(user: UserLike) {
  const metadata = getMetadata(user);
  const draft = getUserProfileDraft(user);

  return (
    metadata.profile_completed === true &&
    Boolean(draft.fullName) &&
    Boolean(draft.age) &&
    Boolean(draft.country)
  );
}

export function sanitizeNextPath(next: string | null | undefined) {
  return next && next.startsWith("/") ? next : APP_ROUTES.dashboard;
}
