import { Clock3, MapPin, Route, Star } from "lucide-react";
import { PageContainer } from "@/components/app/PageContainer";
import { PageIntro } from "@/components/app/PageIntro";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function MarketsPage() {
  return (
    <PageContainer>
      <PageIntro
        actions={
          <>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Favorites
            </Badge>
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              10 km radius
            </Badge>
          </>
        }
        eyebrow="Nearby markets"
        title="Favorites and detail blocks stay location-first"
        description="This route now doubles as the market preference surface and the market detail preview, without bringing in real map or pricing integrations yet."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Favorite markets
            </Badge>
            <CardTitle className="text-2xl">Choose the stores you trust most</CardTitle>
            <CardDescription>
              Keep favorite markets central so later recommendations can weigh
              distance, price, and personal preference together.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Lidl", "Lowest total this week", "2.1 km away"],
              ["Pingo Doce", "Closest stop on short trips", "1.6 km away"],
              ["Continente", "Best for larger restocks", "3.8 km away"],
            ].map(([name, note, distance]) => (
              <div className="rounded-[1.35rem] border border-border bg-card px-4 py-4" key={name}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {note}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                      <MapPin className="size-4" />
                      {distance}
                    </div>
                  </div>
                  <Badge className="rounded-full px-3 py-1" variant="secondary">
                    Favorite
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-5">
          <CardHeader>
            <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
              Market details
            </Badge>
            <CardTitle className="text-2xl">Google Maps-style detail preview</CardTitle>
            <CardDescription>
              Address, hours, rating, and route previews keep the experience
              trustworthy even before real maps or data sources are connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: MapPin, label: "Address", value: "Rua da Prata 112, Lisbon" },
              { icon: Route, label: "Distance", value: "2.1 km from your saved area" },
              { icon: Clock3, label: "Opening hours", value: "08:00 - 22:00 today" },
              { icon: Star, label: "Rating", value: "4.5 / 5 from local shoppers" },
            ].map(({ icon: Icon, label, value }) => (
              <div className="rounded-[1.35rem] bg-secondary px-4 py-4" key={label}>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className="size-4 text-primary" />
                  {label}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
              </div>
            ))}
            <div className="rounded-[1.35rem] bg-accent px-4 py-4 sm:col-span-2">
              <p className="text-sm font-medium text-foreground">Route preview</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Future route mapping can live here. For now, the block keeps the
                detail screen grounded in distance and travel trust.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
