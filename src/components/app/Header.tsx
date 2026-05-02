"use client";

import { MapPin, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/constants/app";
import { getPageMeta } from "@/constants/navigation";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const pathname = usePathname();
  const pageMeta = getPageMeta(pathname);

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8">
      <div className="safe-top mx-auto max-w-6xl">
        <div className="app-surface rounded-[1.75rem] border border-white/80 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.1rem] bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_rgba(31,138,91,0.22)]">
                  PM
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    {APP_NAME}
                  </p>
                  <p className="truncate text-base font-semibold tracking-tight text-foreground">
                    {pageMeta.title}
                  </p>
                </div>
              </div>
              <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-muted-foreground sm:block">
                {pageMeta.description}
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Badge className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground" variant="secondary">
                <MapPin className="size-3.5" />
                Nearby first
              </Badge>
              <Badge className="rounded-full border-primary/15 bg-primary/10 px-3 py-1 text-primary" variant="outline">
                <Sparkles className="size-3.5" />
                Premium PWA
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
