import { APP_NAME } from "@/constants/app";

export default function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl font-semibold text-white shadow-lg shadow-emerald-900/20">
          PM
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          {APP_NAME}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Loading your shopping planner...
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Preparing the local-first foundation and opening your next grocery plan.
        </p>
      </div>
    </main>
  );
}
