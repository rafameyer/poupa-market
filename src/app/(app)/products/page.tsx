import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";

export default function ProductsPage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <EmptyState
          eyebrow="Product catalog"
          title="Products will become reusable building blocks"
          description="This route already exists so later phases can add CRUD, categories, units, and brand details without changing the app structure."
        />

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Foundations already in place
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>TypeScript domain types define product shape and unit options.</li>
            <li>Local-first storage abstractions can persist catalog entries later.</li>
            <li>The page stays intentionally lean to avoid accidental Phase 1 work.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
