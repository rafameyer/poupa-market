"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { APP_NAME } from "@/constants/app";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/Card";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md gap-5 rounded-[2rem] px-8 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </div>
        <div className="space-y-2">
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            {APP_NAME}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Something interrupted this screen
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The UI is designed to recover cleanly. You can retry this screen or
            step back into the dashboard without losing the current app shell.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="sm:flex-1" onClick={() => unstable_retry()} size="lg">
            Try again
          </Button>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
            href="/dashboard"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </div>
      </Card>
    </main>
  );
}
