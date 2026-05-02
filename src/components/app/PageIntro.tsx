import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageIntroProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl space-y-3">
        {eyebrow ? (
          <Badge className="rounded-full px-3 py-1 text-[11px] tracking-[0.18em]" variant="secondary">
            {eyebrow}
          </Badge>
        ) : null}
        <div className="space-y-2">
          <h1 className="text-[2rem] font-semibold tracking-tight text-foreground sm:text-[2.35rem]">
            {title}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
