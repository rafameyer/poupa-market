import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { ListsWorkspace } from "@/components/lists/ListsWorkspace";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ListsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <PageContainer>
      <PageIntro
        eyebrow={messages.lists.eyebrow}
        title={messages.common.createList}
        description={messages.lists.subtitle}
      />

      <ListsWorkspace />
    </PageContainer>
  );
}
