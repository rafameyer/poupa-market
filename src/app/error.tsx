"use client";

import Link from "next/link";
import { useEffect } from "react";
import { APP_NAME } from "@/constants/app";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[var(--shadow)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
          {APP_NAME} error state
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Something interrupted this screen
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Phase 0 keeps the fallback simple so we can recover fast while the app
          foundation is still growing.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button className="sm:flex-1" onClick={() => unstable_retry()}>
            Try again
          </Button>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
