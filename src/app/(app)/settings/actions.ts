"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

export async function logout() {
  const supabase = await createServerSupabaseRouteClient();
  await supabase.auth.signOut();
  redirect("/login");
}
