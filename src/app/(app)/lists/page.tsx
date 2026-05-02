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
        title="Turn free text into compare-ready grocery lists"
        description="Create a list the way you naturally type it, review the parsed groceries, and keep the whole flow mobile-first before comparison logic arrives."
      />

      <ListsWorkspace />
    </PageContainer>
  );
}
