"use client";

import { Check, Mail, MapPin, Star } from "lucide-react";
import { useActionState, useState } from "react";
import { completeRegistration, type CompleteRegistrationState } from "@/app/(auth)/register/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RegistrationOnboardingFormProps {
  initialAge: string;
  initialCountry: string;
  initialEmail: string;
  initialFullName: string;
  nextPath: string;
}

const initialState: CompleteRegistrationState = {};

export function RegistrationOnboardingForm({
  initialAge,
  initialCountry,
  initialEmail,
  initialFullName,
  nextPath,
}: RegistrationOnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(completeRegistration, initialState);
  const [country, setCountry] = useState(initialCountry);
  const [manualLocation, setManualLocation] = useState("");
  const [radius, setRadius] = useState("10");
  const [favoriteMarkets, setFavoriteMarkets] = useState<string[]>(["Lidl", "Continente"]);
  const initials = initialFullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="gap-5 rounded-[2rem] px-6 py-6">
      <div className="flex items-start gap-4">
        <Avatar className="size-14 rounded-[1.4rem]" size="lg">
          <AvatarFallback className="rounded-[1.4rem] bg-primary/10 font-semibold text-primary">
            {initials || "PM"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Badge className="rounded-full px-3 py-1" variant="secondary">
            Finish your setup
          </Badge>
          <div className="space-y-1">
            <h2 className="text-[1.85rem] font-semibold tracking-tight text-foreground">
              Confirm your profile and shopping preferences
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Google already gave us the basics. Keep the account details intact,
              then preview the location-aware setup that will power future market
              comparison.
            </p>
          </div>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        <input name="next" type="hidden" value={nextPath} />

        <div className="space-y-4 rounded-[1.6rem] bg-secondary/70 p-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Profile</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Keep the existing account completion flow, but present it with a
              cleaner mobile-first layout.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Full name</span>
            <Input
              className="h-12 rounded-2xl bg-card px-4"
              defaultValue={initialFullName}
              name="fullName"
              placeholder="Your full name"
              required
              type="text"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              <Mail className="size-4 text-primary" />
              <span>{initialEmail}</span>
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Age</span>
              <Input
                className="h-12 rounded-2xl bg-card px-4"
                defaultValue={initialAge}
                inputMode="numeric"
                max="120"
                min="13"
                name="age"
                placeholder="Your age"
                required
                type="number"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Country</span>
              <Input
                className="h-12 rounded-2xl bg-card px-4"
                name="country"
                onChange={(event) => setCountry(event.target.value)}
                placeholder="Country"
                required
                type="text"
                value={country}
              />
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.6rem] bg-card p-4 ring-1 ring-black/5">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Location & radius</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              These controls are UI placeholders for now, but they reflect the
              next location-first shopping setup from the new design direction.
            </p>
          </div>

          <div className="rounded-[1.35rem] border border-border bg-secondary/70 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="size-[18px]" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Detected location</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {country ? `${country} detected from your profile and browser locale.` : "Location permission placeholder."}
                </p>
              </div>
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Manual location</span>
            <Input
              className="h-12 rounded-2xl bg-card px-4"
              onChange={(event) => setManualLocation(event.target.value)}
              placeholder="Search city or neighborhood"
              type="text"
              value={manualLocation}
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Search radius</p>
            <ToggleGroup
              onValueChange={(value) => value && setRadius(value)}
              type="single"
              value={radius}
            >
              {["1", "10", "20"].map((value) => (
                <ToggleGroupItem className="rounded-full px-4" key={value} value={value}>
                  {value} km
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="rounded-[1.35rem] bg-primary/8 px-4 py-3 text-sm text-primary">
            Live placeholder: <span className="font-semibold">12 markets</span>{" "}
            found within {radius} km.
          </div>
        </div>

        <div className="space-y-4 rounded-[1.6rem] bg-card p-4 ring-1 ring-black/5">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Favorite markets</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Select the stores you already trust so future comparisons can feel
              more personal.
            </p>
          </div>

          <ToggleGroup
            className="flex flex-wrap gap-2"
            onValueChange={(value) => setFavoriteMarkets(value)}
            type="multiple"
            value={favoriteMarkets}
          >
            {["Lidl", "Continente", "Pingo Doce", "Auchan", "Aldi"].map((market) => (
              <ToggleGroupItem
                className="rounded-full border border-border bg-card px-4 text-sm"
                key={market}
                value={market}
              >
                {favoriteMarkets.includes(market) ? <Check className="size-3.5" /> : <Star className="size-3.5" />}
                {market}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {state.message ? (
          <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {state.message}
          </div>
        ) : null}

        <Button className="h-12 w-full text-base" disabled={isPending} size="lg" type="submit">
          {isPending ? "Saving your profile..." : "Finish signup"}
        </Button>
      </form>
    </Card>
  );
}
