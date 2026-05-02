import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="gap-5">
      {eyebrow ? <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">{eyebrow}</Badge> : null}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {children ? <div>{children}</div> : null}
    </Card>
  );
}
