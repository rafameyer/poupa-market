import { logout } from "@/app/(app)/settings/actions";
import { Mail } from "lucide-react";
import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SettingsWorkspace } from "@/features/settings/components/settings-workspace";
import { getUserProfileDraft } from "@/lib/auth/user-profile";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = getUserProfileDraft(user);
  const fullName = profile.fullName || user?.email || "Authenticated user";
  const avatarUrl = profile.avatarUrl;

  return (
    <PageContainer>
      <PageIntro
        eyebrow={messages.settings.eyebrow}
        title={messages.settings.title}
        description={messages.settings.subtitle}
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              {messages.settings.account}
            </Badge>
            <CardTitle>{messages.settings.account}</CardTitle>
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
                <p className="text-sm text-muted-foreground">{user?.email ?? "No email"}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <Mail className="size-4" />
                  Google
                </div>
              </div>
            </div>

            <Card className="gap-3 bg-secondary/70" size="sm">
              <CardContent className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{messages.settings.session}</p>
                </div>
                <form action={logout}>
                  <Button type="submit" variant="outline">
                    {messages.settings.signOut}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <SettingsWorkspace />
      </div>
    </PageContainer>
  );
}
