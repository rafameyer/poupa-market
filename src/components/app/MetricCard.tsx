import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  tone?: "positive" | "neutral" | "warning";
  icon?: ReactNode;
}

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  positive: "bg-primary/10 text-primary",
  neutral: "bg-secondary text-secondary-foreground",
  warning: "bg-amber-100 text-amber-800",
};

export function MetricCard({
  label,
  value,
  change,
  tone = "positive",
  icon,
}: MetricCardProps) {
  return (
    <Card size="sm" className="gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", toneClasses[tone])}>
          {icon ?? (tone === "warning" ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />)}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[1.75rem] font-semibold tracking-tight text-foreground">{value}</p>
        {change ? <p className="text-sm text-muted-foreground">{change}</p> : null}
      </div>
    </Card>
  );
}
