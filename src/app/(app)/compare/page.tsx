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
        title="Browse totals, matches, and savings without crowding mobile"
        description="This route now carries the Figma direction for compare markets, match cards, market details, and a softer savings-history view."
      />

      <CompareWorkspace />
    </PageContainer>
  );
}
