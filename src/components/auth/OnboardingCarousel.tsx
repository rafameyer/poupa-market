"use client";

import { MapPinned, ShoppingBasket, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const slides = [
  {
    icon: MapPinned,
    eyebrow: "Location-aware",
    title: "Compare the markets that actually fit your area",
    description:
      "Keep your grocery planning centered around nearby supermarkets, travel radius, and the places you trust most.",
  },
  {
    icon: ShoppingBasket,
    eyebrow: "List-first",
    title: "Build a list once, then reuse it for weekly habits",
    description:
      "Organize grocery plans by cadence so comparing totals later feels simple instead of repetitive.",
  },
  {
    icon: Sparkles,
    eyebrow: "Savings made clear",
    title: "See what you save without complex tables",
    description:
      "PoupaMarket keeps savings, spend, and best next actions in a cleaner card-based mobile experience.",
  },
];

export function OnboardingCarousel() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Icon = slide.icon;

  return (
    <Card className="gap-5 rounded-[1.75rem] bg-secondary/70">
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Badge className="rounded-full px-3 py-1" variant="secondary">
            {slide.eyebrow}
          </Badge>
          <p className="text-xs font-medium text-muted-foreground">
            {index + 1} / {slides.length}
          </p>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {slide.title}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {slide.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {slides.map((item, itemIndex) => (
              <button
                aria-label={`Show slide ${itemIndex + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  itemIndex === index ? "w-6 bg-primary" : "w-2.5 bg-border",
                )}
                key={item.title}
                onClick={() => setIndex(itemIndex)}
                type="button"
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              disabled={index === 0}
              onClick={() => setIndex((value) => Math.max(0, value - 1))}
              size="sm"
              type="button"
              variant="ghost"
            >
              Back
            </Button>
            <Button
              onClick={() =>
                setIndex((value) => (value + 1 >= slides.length ? 0 : value + 1))
              }
              size="sm"
              type="button"
              variant="outline"
            >
              {index === slides.length - 1 ? "Replay" : "Next"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
