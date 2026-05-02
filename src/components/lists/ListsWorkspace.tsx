"use client";

import { ArrowRight, Clock3, ListTodo, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const listGroups = {
  recent: [
    { name: "Weekly essentials", cadence: "Weekly", items: "18 items", note: "Updated 2 hours ago" },
    { name: "Family pantry top-up", cadence: "Biweekly", items: "26 items", note: "Ready to compare" },
  ],
  pending: [
    { name: "Weekend fresh run", cadence: "One-off", items: "9 items", note: "Missing 2 quantities" },
    { name: "Monthly staples", cadence: "Monthly", items: "31 items", note: "Favorites only" },
  ],
  completed: [
    { name: "End of April grocery run", cadence: "Weekly", items: "22 items", note: "Saved an estimated €11.40" },
    { name: "School lunch refill", cadence: "Biweekly", items: "14 items", note: "Saved an estimated €6.90" },
  ],
} as const;

export function ListsWorkspace() {
  return (
    <div className="space-y-6">
      <Tabs className="gap-4" defaultValue="recent">
        <TabsList className="h-auto rounded-full bg-secondary p-1" variant="default">
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="recent">
            Recent
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="pending">
            Pending
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-4 py-2 data-active:bg-card" value="completed">
            Completed
          </TabsTrigger>
        </TabsList>

        {Object.entries(listGroups).map(([key, lists]) => (
          <TabsContent className="grid gap-4 md:grid-cols-2" key={key} value={key}>
            {lists.map((list) => (
              <Card className="gap-4" key={list.name}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <Badge className="rounded-full px-3 py-1" variant="secondary">
                        {list.cadence}
                      </Badge>
                      <CardTitle>{list.name}</CardTitle>
                      <CardDescription>{list.items}</CardDescription>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ListTodo className="size-[18px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-muted-foreground">{list.note}</p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Clock3 className="size-4" />
                    Compare-ready when you want to move into nearby totals.
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <Card className="gap-5">
        <CardHeader>
          <Badge className="w-fit rounded-full px-3 py-1" variant="secondary">
            Create shopping list
          </Badge>
          <CardTitle className="text-2xl">Start a list and route it into compare</CardTitle>
          <CardDescription>
            Keep this lightweight for now: name the list, choose how broad the
            market search should be, and move into compare when you are ready.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="list-name">
              List name
            </label>
            <Input
              className="h-12 rounded-2xl bg-card px-4"
              id="list-name"
              placeholder="Milk, vegetables, pantry restock..."
              type="text"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Market scope</p>
            <ToggleGroup defaultValue="favorites" type="single">
              <ToggleGroupItem className="rounded-full px-4" value="favorites">
                Favorite markets only
              </ToggleGroupItem>
              <ToggleGroupItem className="rounded-full px-4" value="all">
                All markets
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Nearby radius</p>
            <ToggleGroup defaultValue="10" type="single">
              {["1", "10", "20"].map((value) => (
                <ToggleGroupItem className="rounded-full px-4" key={value} value={value}>
                  {value} km
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Shopping type</p>
            <ToggleGroup className="flex flex-wrap gap-2" defaultValue="weekly" type="single">
              {["Weekly", "Monthly", "Biweekly", "One-off"].map((value) => (
                <ToggleGroupItem
                  className="rounded-full px-4"
                  key={value}
                  value={value.toLowerCase()}
                >
                  {value}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="rounded-[1.4rem] bg-secondary px-4 py-4 text-sm leading-6 text-muted-foreground">
            The creation step stays intentionally lightweight in this phase. When
            a user finishes a list, the next concept is to continue into market
            comparison rather than manage full CRUD.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="size-4" />
              Compare totals instead of showing dense tables on mobile.
            </div>
            <Button asChild className="h-12 px-5 text-base" size="lg">
              <Link href="/compare">
                Go to compare markets
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
