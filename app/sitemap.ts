import type { MetadataRoute } from "next";
import { getAllSlugs, getCategories, getRegions } from "@/lib/companies";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://justapply.dev";
  const slugs = getAllSlugs();

  const companyRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${baseUrl}/company/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getCategories().map((category) => ({
    url: `${baseUrl}/category/${category.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const regionRoutes: MetadataRoute.Sitemap = getRegions().map((region) => ({
    url: `${baseUrl}/region/${region.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryRoutes,
    ...regionRoutes,
    ...companyRoutes,
  ];
}
