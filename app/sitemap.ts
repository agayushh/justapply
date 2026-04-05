import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/companies";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://justapply.dev";
  const slugs = getAllSlugs();

  const companyRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/company/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...companyRoutes,
  ];
}
