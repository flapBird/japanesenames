import type { MetadataRoute } from "next";
import { getIndexableFirstNames, getIndexableSurnames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";

// Sitemap membership is intentionally editorial. Database growth must not
// publish new SEO URLs without an explicit review and allowlist update here.
const staticPagePaths = [
  "",
  "/japanese-last-name-generator",
  "/japanese-girl-names",
  "/japanese-boy-names",
  "/japanese-last-names",
  "/about",
  "/privacy",
  "/terms",
  "/contact",
] as const;

const surnameSlugAllowlist = new Set([
  "yamamoto",
  "tanaka",
  "sato",
  "suzuki",
  "kawaguchi",
  "hayashi",
  "takahashi",
]);

const firstNameSlugAllowlist = new Set([
  "rin",
  "akari",
  "yui",
  "hana",
  "hikari",
  "haruto",
  "ren",
  "sota",
  "takumi",
  "kenji",
  "minato",
  "aoi",
  "kaede",
  "hinata",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-08-23");
  const staticPages = staticPagePaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const surnamePages = getIndexableSurnames()
    .filter((surname) => surnameSlugAllowlist.has(surname.slug))
    .map((surname) => ({
    url: `${siteUrl}/surname/${surname.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    }));
  const firstNamePages = getIndexableFirstNames()
    .filter((name) => firstNameSlugAllowlist.has(name.slug))
    .map((name) => ({
    url: `${siteUrl}/name/${name.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    }));
  return [...staticPages, ...surnamePages, ...firstNamePages];
}
