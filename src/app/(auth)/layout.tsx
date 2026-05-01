import Link from "next/link";
import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Local-first auth shell
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            {APP_NAME}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{APP_TAGLINE}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Login arrives later with Supabase sync. For now, the MVP stays usable
            without an account.
          </p>
        </div>
        {children}
        <div className="mt-6 rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Want to keep exploring?{" "}
          <Link className="font-semibold text-emerald-700" href="/dashboard">
            Continue to the dashboard
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
