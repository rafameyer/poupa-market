"use server";

import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/constants/app";
import {
  getUserMetadata,
  sanitizeNextPath,
} from "@/lib/auth/user-profile";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

export interface CompleteRegistrationState {
  message?: string;
}

export async function completeRegistration(
  _previousState: CompleteRegistrationState,
  formData: FormData,
): Promise<CompleteRegistrationState> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const fullName = String(formData.get("fullName") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? APP_ROUTES.dashboard));

  if (fullName.length < 2) {
    return {
      message: messages.auth.fullNameError,
    };
  }

  const supabase = await createServerSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${APP_ROUTES.login}?next=${encodeURIComponent(nextPath)}`);
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      ...getUserMetadata(user),
      full_name: fullName,
      name: fullName,
      country,
      profile_completed: true,
      profile_completed_at: new Date().toISOString(),
    },
  });

  if (error) {
    return {
      message: `${messages.common.save}: ${error.message}`,
    };
  }

  redirect(nextPath);
}
