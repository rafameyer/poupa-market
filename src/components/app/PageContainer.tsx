import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function PageContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("mx-auto w-full max-w-5xl px-4 py-4 sm:px-6", className)}
      {...props}
    />
  );
}
