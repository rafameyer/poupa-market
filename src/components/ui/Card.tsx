import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/75 bg-white/88 p-5 shadow-[var(--shadow)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
