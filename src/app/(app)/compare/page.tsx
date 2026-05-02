import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { CompareWorkspace } from "@/components/compare/CompareWorkspace";
import { Badge } from "@/components/ui/badge";

export default function ComparePage() {
  return (
    <PageContainer>
      <PageIntro
        actions={
          <>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Totals
            </Badge>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Matches
            </Badge>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              History
            </Badge>
          </>
        }
        eyebrow="Compare markets"
        title="Land on a comparison-ready placeholder with your saved list"
        description="Phase 1 keeps compare visual and structured: select the list you built, preview the scope, and hold space for totals, matches, and savings history."
      />

      <CompareWorkspace />
    </PageContainer>
  );
}
