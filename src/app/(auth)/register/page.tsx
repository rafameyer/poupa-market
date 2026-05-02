import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegistrationOnboardingForm } from "@/components/auth/RegistrationOnboardingForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  getUserProfileDraft,
  hasCompletedRegistration,
  inferCountryFromLocale,
  sanitizeNextPath,
} from "@/lib/auth/user-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Register",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <RegisterForm nextPath={nextPath} />;
  }

  if (hasCompletedRegistration(user)) {
    redirect(nextPath);
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const requestLocale = acceptLanguage.split(",")[0]?.trim() ?? "";
  const profileDraft = getUserProfileDraft(user);
  const initialCountry = profileDraft.country || inferCountryFromLocale(requestLocale);

  return (
    <RegistrationOnboardingForm
      initialCountry={initialCountry}
      initialEmail={profileDraft.email}
      initialFullName={profileDraft.fullName}
      nextPath={nextPath}
    />
  );
}
