"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { OnboardingCarousel } from "@/components/auth/OnboardingCarousel";
import { useAppMessages } from "@/features/preferences/provider";

interface RegisterFormProps {
  nextPath?: string;
}

export function RegisterForm({
  nextPath = "/dashboard",
}: RegisterFormProps) {
  const messages = useAppMessages();

  return (
    <Card className="gap-5 rounded-[2rem] px-6 py-6">
      <div className="space-y-3">
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          {messages.auth.welcome}
        </Badge>
        <div className="space-y-2">
          <h2 className="text-[2rem] font-semibold tracking-tight text-foreground">
            {messages.auth.title}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{messages.auth.subtitle}</p>
        </div>
      </div>

      <OnboardingCarousel />

      <Button asChild className="h-12 w-full text-base" size="lg">
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>
          {messages.auth.button}
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </Card>
  );
}
