import { ChevronRight, ListChecks, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";

interface RegisterFormProps {
  nextPath?: string;
}

export function RegisterForm({
  nextPath = "/dashboard",
}: RegisterFormProps) {
  return (
    <Card className="gap-5 rounded-[2rem] px-6 py-6">
      <div className="space-y-3">
        <Badge className="rounded-full px-3 py-1" variant="secondary">
          Before you enter
        </Badge>
        <div className="space-y-2">
          <h2 className="text-[2rem] font-semibold tracking-tight text-foreground">
            Start with Google
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Sign in first, then we’ll quickly confirm the details and preferences
            that shape your grocery planning experience.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {[
          {
            icon: ListChecks,
            title: "Set up your planning basics",
            description: "Confirm your profile so your lists and savings feel personal from the start.",
          },
          {
            icon: MapPin,
            title: "Choose your shopping area",
            description: "Preview your location and radius preferences before market comparison becomes live.",
          },
          {
            icon: Star,
            title: "Pick the markets you trust most",
            description: "Favorite-market choices will anchor the calmer, more location-aware experience.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="rounded-[1.4rem] border border-border bg-card px-4 py-4"
              key={item.title}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-[18px]" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button asChild className="h-12 w-full text-base" size="lg">
        <Link href={`/login?next=${encodeURIComponent(nextPath)}`}>
          Continue with Google
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </Card>
  );
}
