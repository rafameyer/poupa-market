import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface RegisterFormProps {
  nextPath?: string;
}

export function RegisterForm({
  nextPath = "/dashboard",
}: RegisterFormProps) {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-950">Start with Google</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        PoupaMarket creates the authenticated account through Google OAuth first,
        then asks for the extra profile details we need on the next step.
      </p>

      <div className="mt-6 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <p>
          Use the login screen to start Google sign-in. If this is your first
          time, Google plus Supabase creates the account and then redirects you
          into the profile completion screen.
        </p>
        <p>
          We keep the profile lightweight in this phase by storing the signup
          details in Supabase Auth metadata instead of a custom table.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link
          className="font-semibold text-emerald-700"
          href={`/login?next=${encodeURIComponent(nextPath)}`}
        >
          Continue with Google
        </Link>
        <Button disabled type="button" variant="secondary">
          Profile step after login
        </Button>
      </div>
    </Card>
  );
}
