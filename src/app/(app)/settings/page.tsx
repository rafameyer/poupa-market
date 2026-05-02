import { logout } from "@/app/(app)/settings/actions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";
import { APP_ROUTES } from "@/constants/app";
import {
  getUserProfileDraft,
  hasCompletedRegistration,
} from "@/lib/auth/user-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = getUserProfileDraft(user);
  const fullName = profile.fullName || user?.email || "Authenticated user";
  const avatarUrl = profile.avatarUrl;
  const profileCompleted = hasCompletedRegistration(user);

  return (
    <PageContainer>
      <div className="grid gap-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            User
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={fullName}
                  className="h-full w-full object-cover"
                  src={avatarUrl}
                />
              ) : (
                fullName.slice(0, 1).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{fullName}</h2>
              <p className="text-sm text-slate-600">{user?.email ?? "No email available"}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Provider: Google via Supabase Auth
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white/70 p-4 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-500">Registration status</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {profileCompleted ? "Complete" : "Needs review"}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Full name
                </p>
                <p className="mt-1 text-base text-slate-900">{profile.fullName || "Not set yet"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Age
                </p>
                <p className="mt-1 text-base text-slate-900">{profile.age || "Not set yet"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Country
                </p>
                <p className="mt-1 text-base text-slate-900">
                  {profile.country || "Not set yet"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </p>
                <p className="mt-1 text-base text-slate-900">{profile.email || "Not available"}</p>
              </div>
            </div>
            <div>
              <Link
                className="font-semibold text-emerald-700"
                href={APP_ROUTES.register}
              >
                Review signup details
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              This onboarding-aware auth flow now stores the first profile fields
              directly in Supabase Auth metadata.
            </p>
            <p>
              Richer profile editing, grocery CRUD, and dedicated profile tables
              still stay out of scope for now.
            </p>
          </div>

          <form action={logout} className="mt-6">
            <Button type="submit" variant="secondary">
              Logout
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            What comes next
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Preferred markets and max travel distance.</li>
            <li>Currency and local-first storage transparency.</li>
            <li>No CRUD, tables, payments, or scraping in this phase.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
