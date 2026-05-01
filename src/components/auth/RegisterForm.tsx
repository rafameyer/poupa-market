import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function RegisterForm() {
  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-950">Registration notes</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        In Phase 0.4, account creation is handled by Google OAuth through
        Supabase Auth rather than a separate registration form.
      </p>

      <div className="mt-6 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <p>
          Use the login screen to start Google sign-in. If this is your first
          time, Google plus Supabase will create the account during the auth flow.
        </p>
        <p>
          No separate profile table or custom registration fields are added in
          this phase.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="font-semibold text-emerald-700" href="/login">
          Continue with Google
        </Link>
        <Button disabled type="button" variant="secondary">
          Custom signup later
        </Button>
      </div>
    </Card>
  );
}
