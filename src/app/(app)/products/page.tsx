import { EmptyState } from "@/components/ui/EmptyState";
import { PageContainer } from "@/components/app/PageContainer";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ProductsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <PageContainer>
      <EmptyState
        eyebrow="Products"
        title={messages.products.title}
        description={messages.products.subtitle}
      />
    </PageContainer>
  );
}
