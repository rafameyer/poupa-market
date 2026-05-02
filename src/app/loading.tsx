import { APP_NAME } from "@/constants/app";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <Card className="w-full max-w-sm items-center gap-4 rounded-[2rem] px-8 py-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary text-xl font-semibold text-primary-foreground shadow-[0_14px_32px_rgba(31,138,91,0.22)]">
          PM
        </div>
        <Badge className="rounded-full px-3 py-1 text-[11px] tracking-[0.22em]" variant="secondary">
          {APP_NAME}
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Loading your shopping planner...
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Preparing your mobile planning space and opening the next grocery flow.
        </p>
      </Card>
    </main>
  );
}
