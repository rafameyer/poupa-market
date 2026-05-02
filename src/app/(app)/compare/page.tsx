import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { CompareWorkspace } from "@/components/compare/CompareWorkspace";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ComparePage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <PageContainer>
      <PageIntro
        eyebrow={messages.compare.eyebrow}
        title={messages.compare.title}
        description={messages.compare.subtitle}
      />

      <CompareWorkspace />
    </PageContainer>
  );
}
