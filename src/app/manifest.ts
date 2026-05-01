import type { MetadataRoute } from "next";
import {
  APP_BACKGROUND_COLOR,
  APP_DESCRIPTION,
  APP_NAME,
  APP_SHORT_NAME,
  APP_THEME_COLOR,
} from "@/constants/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: APP_DESCRIPTION,
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: APP_BACKGROUND_COLOR,
    theme_color: APP_THEME_COLOR,
    lang: "en",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
