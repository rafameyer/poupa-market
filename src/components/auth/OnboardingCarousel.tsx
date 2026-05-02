"use client";

import { MapPinned, ShoppingBasket, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppMessages } from "@/features/preferences/provider";

export function OnboardingCarousel() {
  const messages = useAppMessages();
  const slides = [
    { icon: MapPinned, ...messages.auth.preview[0] },
    { icon: ShoppingBasket, ...messages.auth.preview[1] },
    { icon: Sparkles, ...messages.auth.preview[2] },
  ];

  return (
    <div className="grid gap-3">
      {slides.map(({ icon: Icon, title, subtitle }) => (
        <Card className="flex-row items-center gap-3 rounded-[1.5rem] bg-secondary/70 px-4 py-4" key={title} size="sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
            <Icon className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
