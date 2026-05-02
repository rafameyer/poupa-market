import { Compass } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md gap-5 rounded-[2rem] px-8 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-secondary text-primary">
          <Compass className="size-5" />
        </div>
        <div className="space-y-2">
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            404
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            This screen is not available yet
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The route may have moved, or it may belong to a future product flow
            that is not part of the current UI foundation.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_rgba(31,138,91,0.22)] hover:bg-[color:var(--primary-strong)]"
            href="/dashboard"
          >
            Open dashboard
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            href="/login"
          >
            Visit login
          </Link>
        </div>
      </Card>
    </main>
  );
}
