"use client";

import { usePathname } from "next/navigation";
import { APP_NAME } from "@/constants/app";
import { getPageMeta } from "@/constants/navigation";

export function Header() {
  const pathname = usePathname();
  const pageMeta = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-30 px-4">
      <div className="safe-top mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/70 bg-white/78 px-5 pb-5 pt-4 shadow-[0_12px_40px_rgba(12,36,20,0.08)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                {APP_NAME}
              </p>
              <h1 className="mt-3 text-[1.85rem] font-semibold tracking-tight text-slate-950">
                {pageMeta.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {pageMeta.description}
              </p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Phase 0
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
