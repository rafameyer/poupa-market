import { logout } from "@/app/(app)/settings/actions";
import { Mail, MapPin, Plus, Radar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
      <PageIntro
        actions={
          <Badge className="rounded-full px-3 py-1" variant="secondary">
            {profileCompleted ? "Profile complete" : "Needs review"}
          </Badge>
        }
        eyebrow="Settings"
        title="Keep location, radius, and household preferences easy to reach"
        description="This route now reflects the product direction more closely: account identity, shopping area, and family-member placeholders without introducing new backend features yet."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Account
            </Badge>
            <CardTitle className="text-2xl">Profile summary</CardTitle>
            <CardDescription>
              Your Google-auth identity stays intact while the interface becomes
              more mobile-friendly and product-focused.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16" size="lg">
                {avatarUrl ? <AvatarImage alt={fullName} src={avatarUrl} /> : null}
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {fullName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold text-foreground">{fullName}</p>
                <p className="text-sm text-muted-foreground">{user?.email ?? "No email available"}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <Mail className="size-4" />
                  Google via Supabase Auth
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Country", profile.country || "Not set yet"],
                ["Age", profile.age || "Not set yet"],
                ["Primary area", "Lisbon, Portugal"],
                ["Saved radius", "10 km"],
              ].map(([label, value]) => (
                <div className="rounded-[1.35rem] bg-secondary px-4 py-4" key={label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="gap-4">
            <CardHeader>
              <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                Shopping area
              </Badge>
              <CardTitle className="text-2xl">Location and radius</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="size-4 text-primary" />
                  Current location
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Lisbon, Portugal placeholder sourced from your onboarding profile.
                </p>
              </div>
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Radar className="size-4 text-primary" />
                  Search radius
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  1 km, 10 km, and 20 km options stay ready for the live market flow.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4">
            <CardHeader>
              <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                Household
              </Badge>
              <CardTitle className="text-2xl">Add a family member</CardTitle>
              <CardDescription>
                Keep this as a UI placeholder for now: invite by email or member
                ID once collaborative planning is implemented.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input className="h-12 rounded-2xl bg-card px-4" placeholder="Family email" type="email" />
                <Input className="h-12 rounded-2xl bg-card px-4" placeholder="Member ID" type="text" />
              </div>
              <Button className="h-12 w-full sm:w-auto" size="lg" type="button" variant="outline">
                <Plus className="size-4" />
                Add family member
              </Button>
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
                This block stays presentational in Phase 0.5 and does not create
                real household records yet.
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4">
            <CardHeader>
              <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
                Session
              </Badge>
              <CardTitle className="text-2xl">Sign out safely</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={logout}>
                <Button type="submit" variant="outline">
                  Logout
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
