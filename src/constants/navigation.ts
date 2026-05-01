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
    description: "Overview and quick access to the main planning routes.",
    icon: "home",
  },
  {
    href: APP_ROUTES.lists,
    label: "Lists",
    description: "Future shopping list management.",
    icon: "lists",
  },
  {
    href: APP_ROUTES.compare,
    label: "Compare",
    description: "Future savings comparison results.",
    icon: "compare",
  },
  {
    href: APP_ROUTES.markets,
    label: "Markets",
    description: "Favorite stores and market data.",
    icon: "markets",
  },
  {
    href: APP_ROUTES.settings,
    label: "Settings",
    description: "Preferences, install help, and future account controls.",
    icon: "settings",
  },
];

const PAGE_META: Record<string, PageMeta> = {
  [APP_ROUTES.dashboard]: {
    title: "Welcome back",
    description:
      "Use the foundation screens to verify routes, mobile layout, and the Phase 0 shell.",
  },
  [APP_ROUTES.lists]: {
    title: "Shopping lists",
    description:
      "A local-first home for recurring grocery plans and future list totals.",
  },
  [APP_ROUTES.products]: {
    title: "Products",
    description:
      "Prepare the catalog structure for products, units, and categories.",
  },
  [APP_ROUTES.markets]: {
    title: "Markets",
    description:
      "Keep favorite markets, addresses, and distance preferences ready for future data.",
  },
  [APP_ROUTES.prices]: {
    title: "Prices",
    description:
      "Reserve the route for manual price capture before comparison logic arrives.",
  },
  [APP_ROUTES.compare]: {
    title: "Compare savings",
    description:
      "This screen will eventually highlight the cheapest market and estimated savings.",
  },
  [APP_ROUTES.settings]: {
    title: "Settings",
    description:
      "Manage preferences, install guidance, and later sync-related controls.",
  },
};

const FALLBACK_PAGE_META: PageMeta = {
  title: "PoupaMarket",
  description:
    "Plan grocery trips with a mobile-first, local-first Progressive Web App foundation.",
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
