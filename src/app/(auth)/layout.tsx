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
        </div>
        {children}
      </div>
      <div className="safe-bottom pt-4" />
    </div>
  );
}
