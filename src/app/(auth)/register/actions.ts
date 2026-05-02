"use server";

import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/constants/app";
import {
  getUserMetadata,
  sanitizeNextPath,
} from "@/lib/auth/user-profile";
import { createServerSupabaseRouteClient } from "@/lib/supabase/server";

export interface CompleteRegistrationState {
  message?: string;
}

export async function completeRegistration(
  _previousState: CompleteRegistrationState,
  formData: FormData,
): Promise<CompleteRegistrationState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const ageInput = String(formData.get("age") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? APP_ROUTES.dashboard));

  if (fullName.length < 2) {
    return {
      message: "Please enter your full name before continuing.",
    };
  }

  const age = Number(ageInput);

  if (!Number.isInteger(age) || age < 13 || age > 120) {
    return {
      message: "Please enter an age between 13 and 120.",
    };
  }

  if (country.length < 2) {
    return {
      message: "Please confirm your country before continuing.",
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
      age,
      country,
      profile_completed: true,
      profile_completed_at: new Date().toISOString(),
    },
  });

  if (error) {
    return {
      message: `We could not save your profile yet: ${error.message}`,
    };
  }

  redirect(nextPath);
}
