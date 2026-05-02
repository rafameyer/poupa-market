"use client";

import {
  ChartColumnIncreasing,
  House,
  Settings2,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, type NavigationIconName } from "@/constants/navigation";
import { useAppMessages } from "@/features/preferences/provider";
import { cn } from "@/lib/utils";

function NavigationIcon({
  icon,
  className,
}: {
  icon: NavigationIconName;
  className?: string;
}) {
  const iconClassName = cn("size-[18px]", className);

  switch (icon) {
    case "home":
      return <House className={iconClassName} />;
    case "lists":
      return <ShoppingBag className={iconClassName} />;
    case "compare":
      return <ChartColumnIncreasing className={iconClassName} />;
    case "markets":
      return <Store className={iconClassName} />;
    case "settings":
      return <Settings2 className={iconClassName} />;
    default:
      return null;
  }
}

export function BottomNavigation() {
  const pathname = usePathname();
  const messages = useAppMessages();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4">
      <div className="safe-bottom mx-auto max-w-md">
        <div className="pointer-events-auto rounded-[1.9rem] border border-white/75 bg-white/95 p-1.5 shadow-[0_18px_45px_rgba(30,37,41,0.14)] backdrop-blur-xl">
          <div className="grid grid-cols-5 gap-1">
          {MAIN_NAVIGATION.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-2 text-[10px] font-semibold tracking-[0.02em] text-muted-foreground",
                  isActive && "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(31,138,91,0.08)]",
                )}
                href={item.href}
                key={item.href}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    isActive && "bg-primary/12",
                  )}
                >
                  <NavigationIcon icon={item.icon} />
                </div>
                <span>{messages.navigation[item.labelKey]}</span>
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    </nav>
  );
}
