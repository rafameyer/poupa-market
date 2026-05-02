import type { ReactNode } from "react";
import { BottomNavigation } from "@/components/app/BottomNavigation";
import { Header } from "@/components/app/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <BottomNavigation />
    </div>
  );
}
