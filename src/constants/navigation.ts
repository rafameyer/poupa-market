import { APP_ROUTES } from "@/constants/app";

export type NavigationIconName =
  | "home"
  | "lists"
  | "compare"
  | "markets"
  | "settings";

interface NavigationItem {
  href: string;
  label: string;
  description: string;
  icon: NavigationIconName;
}

interface PageMeta {
  title: string;
  description: string;
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    href: APP_ROUTES.dashboard,
    label: "Home",
    description: "Savings, nearby markets, and quick actions.",
    icon: "home",
  },
  {
    href: APP_ROUTES.lists,
    label: "Lists",
    description: "Shopping plans, cadence, and compare-ready lists.",
    icon: "lists",
  },
  {
    href: APP_ROUTES.compare,
    label: "Compare",
    description: "Compare nearby market totals and estimated savings.",
    icon: "compare",
  },
  {
    href: APP_ROUTES.markets,
    label: "Markets",
    description: "Favorite markets, details, and travel radius.",
    icon: "markets",
  },
  {
    href: APP_ROUTES.settings,
    label: "You",
    description: "Account, household, and shopping preferences.",
    icon: "settings",
  },
];

const PAGE_META: Record<string, PageMeta> = {
  [APP_ROUTES.dashboard]: {
    title: "Dashboard",
    description:
      "Keep weekly savings, spending, and your next grocery decision in one calm place.",
  },
  [APP_ROUTES.lists]: {
    title: "Shopping lists",
    description:
      "Shape recent, pending, and completed grocery plans with a clean mobile flow.",
  },
  [APP_ROUTES.products]: {
    title: "Products",
    description:
      "Prepare reusable grocery items without crowding the core shopping flow.",
  },
  [APP_ROUTES.markets]: {
    title: "Nearby markets",
    description:
      "Keep favorite stores, distance context, and detail previews close at hand.",
  },
  [APP_ROUTES.prices]: {
    title: "Prices",
    description:
      "Reserve space for future price capture without complicating the current experience.",
  },
  [APP_ROUTES.compare]: {
    title: "Compare markets",
    description:
      "Compare basket totals, browse matches, and review savings history in a mobile-first way.",
  },
  [APP_ROUTES.settings]: {
    title: "Settings",
    description:
      "Manage location, household preferences, and your current PoupaMarket profile.",
  },
};

const FALLBACK_PAGE_META: PageMeta = {
  title: "PoupaMarket",
  description:
    "Plan grocery trips with a mobile-first savings experience.",
};

export function getPageMeta(pathname?: string | null): PageMeta {
  if (!pathname) {
    return FALLBACK_PAGE_META;
  }

  if (PAGE_META[pathname]) {
    return PAGE_META[pathname];
  }

  const nestedMatch = Object.entries(PAGE_META).find(([route]) =>
    pathname.startsWith(`${route}/`),
  );

  return nestedMatch?.[1] ?? FALLBACK_PAGE_META;
}
