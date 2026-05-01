import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";

export default function ListsPage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <EmptyState
          eyebrow="Shopping cadence"
          title="Shopping list flows start here"
          description="Phase 0 keeps this route lightweight while we prepare weekly, biweekly, and monthly list management for the local MVP."
        >
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
              Weekly
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
              Biweekly
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
              Monthly
            </span>
          </div>
        </EmptyState>

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Planned follow-up stories
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Create, rename, and duplicate shopping lists locally.</li>
            <li>Attach products and quantities with a simple mobile-first flow.</li>
            <li>
              Hand off list totals to the future{" "}
              <Link className="font-semibold text-emerald-700" href="/compare">
                compare
              </Link>{" "}
              route.
            </li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
