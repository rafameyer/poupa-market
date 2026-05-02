import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  APP_THEME_COLOR,
} from "@/constants/app";
import { AppPreferencesProvider } from "@/features/preferences/provider";
import { getRequestLocale } from "@/lib/i18n/server";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: APP_THEME_COLOR,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  keywords: [
    "PoupaMarket",
    "grocery planning",
    "shopping lists",
    "market comparison",
    "PWA",
  ],
  category: "shopping",
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    siteName: APP_NAME,
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-background text-foreground">
        <AppPreferencesProvider initialLocale={locale}>
          {children}
        </AppPreferencesProvider>
      </body>
    </html>
  );
}
