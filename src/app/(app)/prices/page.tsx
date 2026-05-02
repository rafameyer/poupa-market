import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/app/PageContainer";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function PricesPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <PageContainer>
      <EmptyState
        eyebrow="Prices"
        title={messages.prices.title}
        description={messages.prices.subtitle}
      />
    </PageContainer>
  );
}
