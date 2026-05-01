export type PlannedAuthProvider = "apple" | "google" | "magic-link";

export interface AuthStrategy {
  mode: "supabase-google-oauth";
  protectsMainAppRoutes: true;
  syncProvider: "supabase";
  activeProviders: ["google"];
  plannedProviders: PlannedAuthProvider[];
}

export const authStrategy: AuthStrategy = {
  mode: "supabase-google-oauth",
  protectsMainAppRoutes: true,
  syncProvider: "supabase",
  activeProviders: ["google"],
  plannedProviders: ["apple", "google", "magic-link"],
};
