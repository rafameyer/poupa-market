"use client";

import { AlertCircle, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { OnboardingCarousel } from "@/components/auth/OnboardingCarousel";
import { useAppMessages } from "@/features/preferences/provider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface LoginFormProps {
  message?: string;
  nextPath?: string;
}

export function LoginForm({
  message,
  nextPath = "/dashboard",
}: LoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messages = useAppMessages();

  async function signInWithGoogle() {
    setIsSubmitting(true);
    const supabase = createBrowserSupabaseClient();

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        scopes:
          "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      },
    });

    if (error) {
      setIsSubmitting(false);
      router.push(
        `/login?message=${encodeURIComponent(messages.auth.googleError)}`,
      );
    }
  }

  return (
    <Card className="min-h-[34rem] gap-5 rounded-[2rem] px-6 py-6">
      <div className="space-y-3">
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          {messages.auth.welcome}
        </Badge>
        <div className="space-y-2">
          <h2 className="text-[2rem] font-semibold tracking-tight text-foreground">
            {messages.auth.title}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{messages.auth.subtitle}</p>
        </div>
      </div>

      <OnboardingCarousel />

      {message ? (
        <div className="flex items-start gap-3 rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {message}
        </div>
      ) : null}

      <div className="mt-auto space-y-3 pt-4">
        <Button
          className="h-12 w-full text-base"
          disabled={isSubmitting}
          onClick={signInWithGoogle}
          size="lg"
          type="button"
        >
          {isSubmitting ? messages.auth.redirecting : messages.auth.button}
        </Button>

        <div className="flex items-start gap-3 rounded-[1.35rem] bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />
          Google keeps your sign-in fast.
        </div>
      </div>
    </Card>
  );
}
