"use client";

import { useActionState, useState } from "react";
import { completeRegistration, type CompleteRegistrationState } from "@/app/(auth)/register/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-950">Complete your signup</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Google already gave us the basics. Confirm the details below so PoupaMarket
        can finish setting up your account before you enter the main app.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <input name="next" type="hidden" value={nextPath} />

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            defaultValue={initialFullName}
            name="fullName"
            placeholder="Your full name"
            required
            type="text"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-500 outline-none"
            defaultValue={initialEmail}
            disabled
            readOnly
            type="email"
          />
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            Your login email comes from Google and stays tied to your auth account.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Age</span>
          <input
            className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            defaultValue={initialAge}
            inputMode="numeric"
            max="120"
            min="13"
            name="age"
            placeholder="Your age"
            required
            type="number"
          />
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            Google sign-in usually shares your name and email, but not your exact age
            in the default profile scope.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Country</span>
          <input
            className="mt-2 w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            name="country"
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Country"
            required
            type="text"
            value={country}
          />
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            We try to prefill this from your browser locale, and you can correct it if needed.
          </span>
        </label>

        {state.message ? (
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {state.message}
          </div>
        ) : null}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Saving your profile..." : "Finish signup"}
        </Button>
      </form>
    </Card>
  );
}
