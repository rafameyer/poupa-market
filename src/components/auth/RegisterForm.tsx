import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function RegisterForm() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-950">
        Register placeholder
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Registration is not active yet. This placeholder keeps the public auth
        route group ready for future Supabase integration.
      </p>

      <form className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Full name
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            disabled
            placeholder="Maria Silva"
            type="text"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            disabled
            placeholder="name@example.com"
            type="email"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            disabled
            placeholder="Choose a secure password"
            type="password"
          />
        </label>

        <Button className="w-full" disabled type="button">
          Registration comes later
        </Button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="font-semibold text-slate-700" href="/login">
          Back to login
        </Link>
        <Link className="font-semibold text-emerald-700" href="/dashboard">
          Skip for now
        </Link>
      </div>
    </Card>
  );
}
