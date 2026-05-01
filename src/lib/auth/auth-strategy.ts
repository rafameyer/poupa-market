export type PlannedAuthProvider = "apple" | "google" | "magic-link";

export interface AuthStrategy {
  mode: "local-first";
  requiresAccountForMvp: false;
  syncProvider: "supabase";
  plannedProviders: PlannedAuthProvider[];
}

export const authStrategy: AuthStrategy = {
  mode: "local-first",
  requiresAccountForMvp: false,
  syncProvider: "supabase",
  plannedProviders: ["apple", "google", "magic-link"],
};
