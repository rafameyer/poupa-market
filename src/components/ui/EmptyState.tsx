import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <Card>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>
      {children ? <div className="mt-5">{children}</div> : null}
    </Card>
  );
}
