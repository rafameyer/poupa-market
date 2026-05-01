import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[var(--shadow)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          This route is not part of PoupaMarket yet
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page may have moved, or it may belong to a future phase that has
          not been implemented yet.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-700"
            href="/dashboard"
          >
            Open dashboard
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            href="/login"
          >
            Visit auth placeholder
          </Link>
        </div>
      </div>
    </main>
  );
}
