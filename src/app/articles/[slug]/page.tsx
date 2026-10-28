import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ArticleRenderer } from "@/components/articles/ArticleRenderer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { articleBySlug, articles } from "@/data/articles";
import { articleCategoryLabels } from "@/types/articles";
import { estimateReadingMinutes } from "@/lib/articles";
import { breadcrumbJsonLd, siteName, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug.get(slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articleBySlug.get(slug);
  if (!article) notFound();
  const related = article.related
    .map((relatedSlug) => articleBySlug.get(relatedSlug))
    .filter((item) => item !== undefined);
  const published = new Date(article.publishedAt);
  const updated = new Date(article.updatedAt);
  return (
    <div className="container-page themed-page theme-sakura">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.metaDescription,
          datePublished: published.toISOString(),
          dateModified: updated.toISOString(),
          author: { "@type": "Organization", name: siteName, url: siteUrl },
          publisher: { "@type": "Organization", name: siteName, url: siteUrl },
          mainEntityOfPage: `${siteUrl}/articles/${article.slug}`,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ])}
      />
      {article.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: "Articles", href: "/articles" },
          { label: article.title },
        ]}
      />
      <article className="py-6">
        <header className="max-w-3xl">
          <p className="eyebrow">{articleCategoryLabels[article.category]}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-[#647068]">
            Published {published.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {" · "}
            {estimateReadingMinutes(article)} min read
          </p>
        </header>
        <div className="mt-8 max-w-3xl">
          {article.intro.map((paragraph, index) => (
            <p
              className={index === 0 ? "text-lg leading-8 text-[#3d463f]" : "mt-5 leading-7 text-[#59645d]"}
              key={`intro-${index}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <ArticleRenderer blocks={article.blocks} />
        {article.faq.length > 0 && (
          <section className="mt-14 max-w-3xl">
            <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
            <div className="mt-6 grid gap-4">
              {article.faq.map((item) => (
                <details className="surface p-5" key={item.question}>
                  <summary className="cursor-pointer font-semibold">{item.question}</summary>
                  <p className="mt-3 text-sm leading-6 text-[#59645d]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        <section className="mt-12 max-w-3xl rounded-xl border border-[#d8e2d8] bg-[#f4f7f3] p-6">
          <h2 className="text-lg font-semibold text-[#315c4b]">Explore the records behind this guide</h2>
          <p className="mt-2 text-sm leading-6 text-[#59645d]">
            Build a full name in the{" "}
            <Link className="font-bold text-[#315c4b] underline underline-offset-4" href="/#generator">
              Japanese name generator
            </Link>
            , browse{" "}
            <Link className="font-bold text-[#315c4b] underline underline-offset-4" href="/japanese-girl-names">girl names</Link>,{" "}
            <Link className="font-bold text-[#315c4b] underline underline-offset-4" href="/japanese-boy-names">boy names</Link>, or{" "}
            <Link className="font-bold text-[#315c4b] underline underline-offset-4" href="/japanese-last-names">surnames</Link>{" "}
            with kanji, readings, and meaning notes.
          </p>
        </section>
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold">Keep reading</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard article={item} key={item.slug} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
