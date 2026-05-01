import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";

export default function ComparePage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <EmptyState
          eyebrow="Savings view"
          title="Comparison will summarize totals across nearby markets"
          description="This route reserves the user journey for the eventual savings engine while staying strictly within the Phase 0 foundation brief."
        />

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Planned result shape
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Each market will expose a total and a list of missing products.</li>
            <li>The cheapest market and estimated savings are already typed.</li>
            <li>No actual comparison logic has been implemented yet.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
