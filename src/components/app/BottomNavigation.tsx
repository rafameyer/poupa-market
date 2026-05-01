"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, type NavigationIconName } from "@/constants/navigation";
import { cn } from "@/lib/utils/cn";

function NavigationIcon({
  icon,
  className,
}: {
  icon: NavigationIconName;
  className?: string;
}) {
  const iconClassName = cn("h-5 w-5", className);

  switch (icon) {
    case "home":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path
            d="M4 10.75L12 4l8 6.75V20a1 1 0 0 1-1 1h-4.75v-5.5h-4.5V21H5a1 1 0 0 1-1-1v-9.25Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "lists":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path
            d="M8 7h10M8 12h10M8 17h10M4.5 7h.01M4.5 12h.01M4.5 17h.01"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "compare":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path
            d="M7 18V9m5 9V6m5 12v-4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M5 20h14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "markets":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path
            d="M6 9.5h12l-1 9.5H7L6 9.5Zm1-3.5h10l2 3.5H5L7 6Zm3.5 6v4m3-4v4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      );
    case "settings":
      return (
        <svg className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path
            d="M12 8.75A3.25 3.25 0 1 1 12 15.25A3.25 3.25 0 0 1 12 8.75Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M18.2 13.18a1 1 0 0 0 .2 1.1l.04.04a1.67 1.67 0 0 1 0 2.36a1.67 1.67 0 0 1-2.36 0l-.04-.04a1 1 0 0 0-1.1-.2a1 1 0 0 0-.61.92V18a1.67 1.67 0 0 1-3.34 0v-.06a1 1 0 0 0-.65-.94a1 1 0 0 0-1.08.22l-.04.04a1.67 1.67 0 0 1-2.36 0a1.67 1.67 0 0 1 0-2.36l.04-.04a1 1 0 0 0 .2-1.1a1 1 0 0 0-.92-.61H6A1.67 1.67 0 0 1 6 9.81h.06a1 1 0 0 0 .94-.65a1 1 0 0 0-.22-1.08l-.04-.04a1.67 1.67 0 0 1 0-2.36a1.67 1.67 0 0 1 2.36 0l.04.04a1 1 0 0 0 1.1.2a1 1 0 0 0 .61-.92V4A1.67 1.67 0 0 1 14.19 4v.06a1 1 0 0 0 .65.94a1 1 0 0 0 1.08-.22l.04-.04a1.67 1.67 0 0 1 2.36 0a1.67 1.67 0 0 1 0 2.36l-.04.04a1 1 0 0 0-.2 1.1a1 1 0 0 0 .92.61H20a1.67 1.67 0 1 1 0 3.34h-.06a1 1 0 0 0-.94.65Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.4"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4">
      <div className="safe-bottom mx-auto max-w-3xl">
        <div className="pointer-events-auto grid grid-cols-5 rounded-[2rem] border border-white/80 bg-white/92 p-2 shadow-[var(--shadow)] backdrop-blur-xl">
          {MAIN_NAVIGATION.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-2 text-[11px] font-semibold tracking-[0.03em] text-slate-500",
                  isActive && "bg-emerald-50 text-emerald-700",
                )}
                href={item.href}
                key={item.href}
              >
                <NavigationIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
