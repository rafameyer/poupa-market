import { logout } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName =
    user?.user_metadata.full_name ??
    user?.user_metadata.name ??
    user?.email ??
    "Authenticated user";
  const avatarUrl = user?.user_metadata.avatar_url as string | undefined;

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

          <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              This Phase 0.4 implementation adds authenticated session handling
              and protects the main app routes.
            </p>
            <p>
              Grocery CRUD, user profile tables, and richer settings stay out of
              scope for now.
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
