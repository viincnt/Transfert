import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/shared";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl.href,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/privacy", siteUrl).href,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
