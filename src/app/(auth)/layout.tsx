import Link from "next/link";
import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Supabase Auth shell
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            {APP_NAME}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{APP_TAGLINE}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Google sign-in is enabled through Supabase Auth for this phase. The
            public auth routes stay outside the protected main app shell, and
            first-time users finish a lightweight signup step after Google login.
          </p>
        </div>
        {children}
        <div className="mt-6 rounded-[1.5rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          After login you will return to the protected app. Need the setup
          details? Check the auth docs in the repository.
          {" "}
          <Link className="font-semibold text-emerald-700" href="/dashboard">
            Dashboard redirects if you are not signed in
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
