"use client";

import Link from "next/link";
import { Check, Mail, MapPin, Star } from "lucide-react";
import { useActionState } from "react";
import { completeRegistration, type CompleteRegistrationState } from "@/app/(auth)/register/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAppMessages } from "@/features/preferences/provider";

interface RegistrationOnboardingFormProps {
  initialCountry: string;
  initialEmail: string;
  initialFullName: string;
  nextPath: string;
}

const initialState: CompleteRegistrationState = {};

export function RegistrationOnboardingForm({
  initialCountry,
  initialEmail,
  initialFullName,
  nextPath,
}: RegistrationOnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(completeRegistration, initialState);
  const messages = useAppMessages();
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
            {messages.auth.setupTitle}
          </Badge>
          <div className="space-y-1">
            <h2 className="text-[1.85rem] font-semibold tracking-tight text-foreground">
              {messages.auth.finishSetup}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {messages.auth.setupSubtitle}
            </p>
          </div>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input name="next" type="hidden" value={nextPath} />

        <div className="grid gap-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">{messages.auth.fullName}</span>
            <Input
              className="h-12 rounded-2xl bg-card px-4"
              defaultValue={initialFullName}
              name="fullName"
              placeholder="Rafael Meyer"
              required
              type="text"
            />
          </label>

          <div className="rounded-[1.35rem] border border-border bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Mail className="size-4 text-primary" />
              {messages.auth.email}
            </div>
            <p className="mt-2">{initialEmail}</p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">{messages.auth.country}</span>
            <Input
              className="h-12 rounded-2xl bg-card px-4"
              defaultValue={initialCountry}
              name="country"
              placeholder="Portugal"
              type="text"
            />
          </label>
        </div>

        <div className="grid gap-3">
          {[
            { icon: MapPin, title: messages.dashboard.setLocation },
            { icon: Star, title: messages.dashboard.addFavorites },
            { icon: Check, title: messages.dashboard.createFirst },
          ].map(({ icon: Icon, title }) => (
            <div className="rounded-[1.35rem] bg-secondary px-4 py-4" key={title}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary">
                  <Icon className="size-4" />
                </div>
                <p className="font-medium text-foreground">{title}</p>
              </div>
            </div>
          ))}
        </div>

        {state.message ? (
          <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {state.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <Button className="h-12 w-full text-base" disabled={isPending} size="lg" type="submit">
            {isPending ? `${messages.common.loading}...` : messages.auth.finishSetup}
          </Button>
          <Button asChild className="h-12 w-full text-base" size="lg" variant="outline">
            <Link href={nextPath}>{messages.auth.goToApp}</Link>
          </Button>
        </div>
      </form>
    </Card>
  );
}
