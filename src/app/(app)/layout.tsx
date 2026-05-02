import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";
import { APP_ROUTES } from "@/constants/app";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MainAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(APP_ROUTES.login);
  }

  return <AppShell>{children}</AppShell>;
}
