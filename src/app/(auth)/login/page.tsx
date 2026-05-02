import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { APP_ROUTES } from "@/constants/app";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; message?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(params.next && params.next.startsWith("/") ? params.next : APP_ROUTES.dashboard);
  }

  return (
    <LoginForm
      message={params.message}
      nextPath={params.next && params.next.startsWith("/") ? params.next : "/dashboard"}
    />
  );
}
