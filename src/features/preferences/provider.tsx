"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type AppLocale } from "@/lib/i18n/config";
import { getMessages, type AppMessages } from "@/lib/i18n/messages";
import {
  DEFAULT_USER_PREFERENCES,
  loadUserPreferences,
  normalizeUserPreferences,
  saveUserPreferences,
} from "@/features/preferences/storage";
import type { UserPreferences } from "@/features/preferences/types";

interface AppPreferencesContextValue {
  locale: AppLocale;
  messages: AppMessages;
  preferences: UserPreferences;
  isReady: boolean;
  updatePreferences: (
    updater:
      | Partial<UserPreferences>
      | ((current: UserPreferences) => UserPreferences),
  ) => void;
}

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: AppLocale;
}) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPreferences(loadUserPreferences());
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const updatePreferences = useCallback<
    AppPreferencesContextValue["updatePreferences"]
  >((updater) => {
    setPreferences((current) => {
      const nextPreferences =
        typeof updater === "function"
          ? normalizeUserPreferences(updater(current))
          : normalizeUserPreferences({ ...current, ...updater });

      saveUserPreferences(nextPreferences);
      return nextPreferences;
    });
  }, []);

  const locale = preferences.manualLanguage ?? initialLocale;
  const messages = useMemo(() => getMessages(locale), [locale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      locale,
      messages,
      preferences,
      isReady,
      updatePreferences,
    }),
    [isReady, locale, messages, preferences, updatePreferences],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider.");
  }

  return context;
}

export function useAppMessages() {
  return useAppPreferences().messages;
}
