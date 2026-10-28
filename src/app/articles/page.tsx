import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { articles } from "@/data/articles";
import { articleCategoryLabels, type ArticleCategory } from "@/types/articles";
import { breadcrumbJsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Japanese Name Guides & Articles",
  description:
    "Guides to Japanese names: the most popular names, 100 common surnames, names by meaning (moon, light, flower, snow, love), unisex names, anime names, and how Japanese naming works.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "Japanese Name Guides & Articles",
    description:
      "Guides to Japanese names: popularity, surnames, meanings by theme, unisex names, and naming customs.",
    url: "/articles",
  },
  twitter: {
    card: "summary",
    title: "Japanese Name Guides & Articles",
    description:
      "Guides to Japanese names: popularity, surnames, meanings by theme, unisex names, and naming customs.",
  },
};

const categoryOrder: ArticleCategory[] = ["popular", "meanings", "lists", "culture"];

export default function ArticlesPage() {
  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: articles.filter((article) => article.category === category),
    }))
    .filter((group) => group.items.length > 0);
  return (
    <div className="container-page themed-page theme-sakura">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Japanese Name Guides & Articles",
          url: `${siteUrl}/articles`,
          hasPart: articles.map((article) => ({
            "@type": "Article",
            headline: article.title,
            url: `${siteUrl}/articles/${article.slug}`,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
        ])}
      />
      <Breadcrumbs items={[{ label: "Articles" }]} />
      <header className="page-intro my-6 max-w-3xl">
        <p className="eyebrow">Guides</p>
        <h1 className="section-title">Japanese Name Guides &amp; Articles</h1>
        <p className="mt-4 text-base leading-7 text-[#59645d]">
          Long-form guides to Japanese names: what is popular in Japan right now,
          what the 100 most common surnames mean, names grouped by the images they
          carry — moon, light, flowers, snow, love — plus unisex names, anime
          names, and the customs that shape how Japanese names are built.
        </p>
      </header>
      {grouped.map((group) => (
        <section className="py-8" key={group.category}>
          <h2 className="text-xl font-semibold text-[#315c4b]">
            {articleCategoryLabels[group.category]}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.items.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </section>
      ))}
      <section className="mt-8 rounded-xl border border-[#d8e2d8] bg-[#f4f7f3] p-6">
        <h2 className="text-lg font-semibold">Prefer to explore the records?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#59645d]">
          Every guide links into our browsable collection of{" "}
          <a className="font-bold text-[#315c4b] underline underline-offset-4" href="/japanese-girl-names">girl names</a>,{" "}
          <a className="font-bold text-[#315c4b] underline underline-offset-4" href="/japanese-boy-names">boy names</a>, and{" "}
          <a className="font-bold text-[#315c4b] underline underline-offset-4" href="/japanese-last-names">surnames</a> —
          or build a full name in the{" "}
          <Link className="font-bold text-[#315c4b] underline underline-offset-4" href="/#generator">Japanese name generator</Link>.
        </p>
      </section>
    </div>
  );
}
