import { APP_ROUTES } from "@/constants/app";

export type NavigationIconName =
  | "home"
  | "lists"
  | "compare"
  | "markets"
  | "settings";

interface NavigationItem {
  href: string;
  labelKey: "home" | "lists" | "compare" | "markets" | "settings";
  icon: NavigationIconName;
}

interface PageMeta {
  title: string;
  description?: string;
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    href: APP_ROUTES.dashboard,
    labelKey: "home",
    icon: "home",
  },
  {
    href: APP_ROUTES.lists,
    labelKey: "lists",
    icon: "lists",
  },
  {
    href: APP_ROUTES.compare,
    labelKey: "compare",
    icon: "compare",
  },
  {
    href: APP_ROUTES.markets,
    labelKey: "markets",
    icon: "markets",
  },
  {
    href: APP_ROUTES.settings,
    labelKey: "settings",
    icon: "settings",
  },
];

const PAGE_META: Record<string, PageMeta> = {
  [APP_ROUTES.dashboard]: {
    title: "Home",
  },
  [APP_ROUTES.lists]: {
    title: "Lists",
  },
  [APP_ROUTES.products]: {
    title: "Products",
  },
  [APP_ROUTES.markets]: {
    title: "Markets",
  },
  [APP_ROUTES.prices]: {
    title: "Prices",
  },
  [APP_ROUTES.compare]: {
    title: "Compare",
  },
  [APP_ROUTES.settings]: {
    title: "You",
  },
};

const FALLBACK_PAGE_META: PageMeta = {
  title: "PoupaMarket",
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
