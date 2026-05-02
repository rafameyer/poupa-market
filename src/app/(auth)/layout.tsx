import type { ReactNode } from "react";
import { APP_NAME } from "@/constants/app";
import { Badge } from "@/components/ui/badge";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-6 sm:px-6">
      <div className="safe-top flex flex-1 flex-col justify-center gap-5">
        <div className="space-y-3">
          <Badge className="rounded-full px-3 py-1 text-[11px] tracking-[0.22em]" variant="secondary">
            {APP_NAME}
          </Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">
              Grocery savings, made simpler.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Sign in with Google, set your shopping preferences, and keep the
              experience centered on nearby markets, clear totals, and calm mobile
              flows.
            </p>
          </div>
        </div>
        {children}
      </div>
      <p className="safe-bottom pt-4 text-center text-xs leading-5 text-muted-foreground">
        Google authentication is already connected through Supabase and your
        protected routes will stay intact after sign in.
      </p>
    </div>
  );
}
