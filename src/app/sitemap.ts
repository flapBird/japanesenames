import type { MetadataRoute } from "next";
import { getIndexableFirstNames, getIndexableSurnames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-07-29");
  const staticPages = [
    "",
    "/japanese-girl-names",
    "/japanese-boy-names",
    "/japanese-last-names",
    "/about",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const surnamePages = getIndexableSurnames().map((surname) => ({
    url: `${siteUrl}/surname/${surname.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const firstNamePages = getIndexableFirstNames().map((name) => ({
    url: `${siteUrl}/name/${name.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...surnamePages, ...firstNamePages];
}
