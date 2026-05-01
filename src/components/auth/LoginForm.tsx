"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

  async function signInWithGoogle() {
    setIsSubmitting(true);
    const supabase = createBrowserSupabaseClient();

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setIsSubmitting(false);
      router.push(
        `/login?message=${encodeURIComponent("Google sign-in could not be started.")}`,
      );
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-950">
        Continue with Google
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Supabase Auth handles the sign-in flow for PoupaMarket. Google is the
        first enabled provider in this phase.
      </p>

      {message ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <Button
          className="w-full"
          disabled={isSubmitting}
          onClick={signInWithGoogle}
          type="button"
        >
          {isSubmitting ? "Redirecting to Google..." : "Continue with Google"}
        </Button>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          After Google authentication, Supabase redirects you back to PoupaMarket
          and unlocks the protected app routes.
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="font-semibold text-slate-700" href="/register">
          Register notes
        </Link>
        <span className="font-semibold text-emerald-700">Next: {nextPath}</span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Local development requires valid Supabase environment variables before
        the Google flow can start.
      </p>
    </Card>
  );
}
