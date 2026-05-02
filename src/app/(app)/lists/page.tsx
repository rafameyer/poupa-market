import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { ListsWorkspace } from "@/components/lists/ListsWorkspace";
import { Badge } from "@/components/ui/badge";

export default function ListsPage() {
  return (
    <PageContainer>
      <PageIntro
        actions={
          <>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Recent
            </Badge>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Pending
            </Badge>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Completed
            </Badge>
          </>
        }
        eyebrow="Shopping lists"
        title="Keep list flows simple and compare-ready"
        description="This route now reflects the Figma direction: segmented list states, a lightweight creation area, and a clear handoff into compare markets."
      />

      <ListsWorkspace />
    </PageContainer>
  );
}
