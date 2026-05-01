function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not set. Check your local environment variables.`);
  }

  return value;
}

export function getSupabaseUrl() {
  return requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey() {
  return requireEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}
