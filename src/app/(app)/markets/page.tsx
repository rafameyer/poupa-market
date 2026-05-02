import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { MarketsWorkspace } from "@/features/markets/components/markets-workspace";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function MarketsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <PageContainer>
      <PageIntro
        eyebrow={messages.markets.eyebrow}
        title={messages.markets.title}
        description={messages.markets.subtitle}
      />

      <MarketsWorkspace />
    </PageContainer>
  );
}
