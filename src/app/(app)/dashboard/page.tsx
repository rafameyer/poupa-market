import { ArrowRight, CreditCard, MapPin, Receipt, Store, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/app/MetricCard";
import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { APP_ROUTES } from "@/constants/app";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageIntro
        actions={
          <>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              <MapPin className="mr-1 size-3.5" />
              Lisbon area
            </Badge>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              10 km radius
            </Badge>
          </>
        }
        eyebrow="Savings snapshot"
        title="A calmer dashboard for your next grocery decision"
        description="Keep weekly savings, monthly spending, and the nearest next action visible before real comparison logic arrives."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard change="Compared with your average nearby basket" icon={<TrendingUp className="size-4" />} label="Weekly savings" value="€6.10" />
        <MetricCard change="Across this month's placeholder trips" icon={<TrendingUp className="size-4" />} label="Monthly savings" value="€24.80" />
        <MetricCard change="Estimated spend for planned trips" icon={<CreditCard className="size-4" />} label="Monthly spend" tone="neutral" value="€188.40" />
        <MetricCard change="One store is still over your usual target" icon={<TrendingDown className="size-4" />} label="Most expensive run" tone="warning" value="€58.90" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="gap-5 bg-[linear-gradient(135deg,#1f8a5b_0%,#23796c_40%,#2c8a74_100%)] text-white ring-0">
          <CardHeader>
            <Badge className="w-fit rounded-full border-white/15 bg-white/12 px-3 py-1 text-white" variant="outline">
              Recommended next step
            </Badge>
            <CardTitle className="text-[2rem] text-white">
              Compare your weekly essentials across nearby markets
            </CardTitle>
            <CardDescription className="text-white/80">
              Use the list flow to keep things lightweight, then move straight into compare instead of managing a dense mobile table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/12 px-3 py-1">Favorites first</span>
              <span className="rounded-full bg-white/12 px-3 py-1">10 km search</span>
              <span className="rounded-full bg-white/12 px-3 py-1">Card-based results</span>
            </div>
            <Button asChild className="h-12 bg-white text-primary hover:bg-white/92" size="lg">
              <Link href={APP_ROUTES.compare}>
                Open compare markets
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Nearby focus
            </Badge>
            <CardTitle className="text-2xl">Favorite markets at a glance</CardTitle>
            <CardDescription>
              Keep location and trust visible before you even start comparing totals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Lidl", "2.1 km away"],
              ["Pingo Doce", "1.6 km away"],
              ["Continente", "3.8 km away"],
            ].map(([name, distance]) => (
              <div className="flex items-center justify-between rounded-[1.35rem] bg-secondary px-4 py-3" key={name}>
                <div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{distance}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-card text-primary">
                  <Store className="size-[18px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="gap-4">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Last purchases
            </Badge>
            <CardTitle className="text-2xl">Recent grocery runs</CardTitle>
            <CardDescription>
              Placeholder history blocks keep the experience familiar while real purchase data stays out of scope.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Weekly essentials", "Lidl", "€42.70"],
              ["Pantry refill", "Continente", "€51.30"],
              ["Fresh vegetables", "Pingo Doce", "€18.40"],
            ].map(([name, market, total]) => (
              <div className="flex items-center justify-between rounded-[1.35rem] border border-border bg-card px-4 py-4" key={name}>
                <div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{market}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{total}</p>
                  <p className="text-sm text-primary">Saved placeholder</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Quick actions
            </Badge>
            <CardTitle className="text-2xl">Move through the flow</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              [APP_ROUTES.lists, "Shape a new list", "Start from a grocery idea and choose its cadence."],
              [APP_ROUTES.compare, "Review compare results", "See totals, match cards, and placeholder savings history."],
              [APP_ROUTES.settings, "Adjust your area", "Keep location, radius, and family settings easy to reach."],
            ].map(([href, label, description]) => (
              <Link href={href} key={href}>
                <div className="rounded-[1.35rem] bg-secondary px-4 py-4 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <Receipt className="size-[18px] shrink-0 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
