import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";

export default function MarketsPage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <EmptyState
          eyebrow="Nearby stores"
          title="Markets will anchor favorites, addresses, and distance rules"
          description="Phase 0 prepares the route and types so market preferences can slot in cleanly during the local MVP."
        />

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            Future market data
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Name, address, favorite status, and optional distance fields are typed.</li>
            <li>
              This route will later connect to{" "}
              <Link className="font-semibold text-emerald-700" href="/prices">
                price entries
              </Link>{" "}
              and comparison totals.
            </li>
            <li>No scraping or automatic imports are included in Phase 0.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
