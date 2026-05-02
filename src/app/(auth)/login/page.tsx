import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { APP_ROUTES } from "@/constants/app";
import { hasCompletedRegistration } from "@/lib/auth/user-profile";
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
    redirect(hasCompletedRegistration(user) ? APP_ROUTES.dashboard : APP_ROUTES.register);
  }

  return (
    <LoginForm
      message={params.message}
      nextPath={params.next && params.next.startsWith("/") ? params.next : "/dashboard"}
    />
  );
}
