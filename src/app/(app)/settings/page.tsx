import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <EmptyState
          eyebrow="Preferences"
          title="Settings will gather install guidance, markets, and account hooks"
          description="The route is ready for user preferences, market filters, and future sync controls once those features become real."
        />

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Placeholder sections
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Preferred markets and max travel distance.</li>
            <li>Currency and local-first storage transparency.</li>
            <li>
              Auth entry points currently live in the{" "}
              <Link className="font-semibold text-emerald-700" href="/login">
                login
              </Link>{" "}
              and{" "}
              <Link className="font-semibold text-emerald-700" href="/register">
                register
              </Link>{" "}
              placeholders.
            </li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
