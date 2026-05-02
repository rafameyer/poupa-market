import { PageContainer } from "@/components/app/PageContainer";
import { DashboardWorkspace } from "@/features/dashboard/components/dashboard-workspace";
import { getUserProfileDraft } from "@/lib/auth/user-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = getUserProfileDraft(user);
  const givenName =
    typeof user?.user_metadata?.given_name === "string"
      ? user.user_metadata.given_name
      : "";
  const userName =
    profile.fullName ||
    givenName ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <PageContainer>
      <DashboardWorkspace userName={userName} />
    </PageContainer>
  );
}
