import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";

export default function PricesPage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <EmptyState
          eyebrow="Price entries"
          title="Price capture arrives in the next implementation phase"
          description="The route exists now so Phase 1 can add manual price entry, timestamps, and notes without touching navigation or shared types."
        />

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Guardrails for this phase
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>No OCR, scanning, or scraping is included.</li>
            <li>Entries are typed but there is no CRUD or persistence UI yet.</li>
            <li>The comparison engine stays out of scope until list and market data exist.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
