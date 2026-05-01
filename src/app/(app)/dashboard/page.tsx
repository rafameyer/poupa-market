import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/app/PageContainer";
import { APP_ROUTES } from "@/constants/app";

const quickLinks = [
  {
    href: APP_ROUTES.lists,
    label: "Shopping lists",
    description: "Prepare weekly, biweekly, and monthly list flows in Phase 1.",
  },
  {
    href: APP_ROUTES.compare,
    label: "Compare totals",
    description: "Reserve space for the savings engine without building it yet.",
  },
  {
    href: APP_ROUTES.markets,
    label: "Markets",
    description: "Map favorite stores, addresses, and distance preferences next.",
  },
  {
    href: APP_ROUTES.settings,
    label: "Settings",
    description: "Keep future preferences, install guidance, and account hooks tidy.",
  },
];

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="grid gap-4">
        <Card className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            Phase 0 foundation
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            The app shell is ready for future grocery features
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50">
            This starter focuses on routes, mobile navigation, local-first
            boundaries, and PWA setup so the next phases can add real data safely.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1">
              Next.js App Router
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">Tailwind CSS</span>
            <span className="rounded-full bg-white/15 px-3 py-1">PWA baseline</span>
            <span className="rounded-full bg-white/15 px-3 py-1">TypeScript</span>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {quickLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              <Card className="h-full hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Explore
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">
                  {link.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {link.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-slate-950">
            What comes next
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Products, markets, and price entry stay as typed placeholders only.</li>
            <li>The storage abstraction is ready for localStorage now and cloud sync later.</li>
            <li>Installability is configured for Safari home-screen use on iPhone and iPad.</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
