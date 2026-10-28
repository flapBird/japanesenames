import type { MetadataRoute } from "next";
import { getIndexableFirstNames, getIndexableSurnames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";
import { articles } from "@/data/articles";

// Sitemap membership follows the publish gate in src/data/publish-policy.ts:
// every record that passes verification and data-sufficiency checks gets a
// URL here. Records held back for editorial reasons keep isIndexable: false
// and stay out of this file.
const staticPagePaths = [
  "",
  "/japanese-last-name-generator",
  "/japanese-girl-names",
  "/japanese-boy-names",
  "/japanese-last-names",
  "/articles",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
] as const;

// Dates reflect when page content last changed materially. Bump the detail
// page date when a new data batch is published or the templates change.
const detailPagesUpdated = new Date("2026-10-29");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = staticPagePaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: ["/about", "/privacy", "/terms"].includes(path)
      ? new Date("2026-10-25")
      : ["", "/japanese-girl-names", "/japanese-boy-names", "/japanese-last-names"].includes(path)
        ? new Date("2026-09-09") : detailPagesUpdated,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const surnamePages = getIndexableSurnames().map((surname) => ({
    url: `${siteUrl}/surname/${surname.slug}`,
    lastModified: detailPagesUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const firstNamePages = getIndexableFirstNames().map((name) => ({
    url: `${siteUrl}/name/${name.slug}`,
    lastModified: detailPagesUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const articlePages = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...articlePages, ...surnamePages, ...firstNamePages];
}
