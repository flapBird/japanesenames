import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ArticleRenderer } from "@/components/articles/ArticleRenderer";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleTocNav } from "@/components/articles/ArticleTocNav";
import { articleBySlug, articles } from "@/data/articles";
import { articleCategoryLabels } from "@/types/articles";
import { articleToc, estimateReadingMinutes } from "@/lib/articles";
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
  const publishedLabel = published.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedLabel = updated.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const minutes = estimateReadingMinutes(article);
  const toc = [
    ...articleToc(article),
    ...(article.faq.length > 0
      ? [{ id: "article-faq", number: "FAQ", label: "Questions and answers" }]
      : []),
  ];
  return (
    <div className="themed-page theme-sakura">
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
      <div className="container-page pt-1">
        <Breadcrumbs
          items={[
            { label: "Articles", href: "/articles" },
            { label: article.title },
          ]}
        />
      </div>

      <header className="container-page relative pb-1 pt-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1 top-2 hidden h-24 w-24 rotate-3 place-items-center rounded-2xl border-[1.5px] border-(--sakura)/45 lg:grid"
        >
          <span className="japanese-display text-5xl text-(--sakura)/60">名</span>
        </div>
        <div className="max-w-3xl">
          <p className="eyebrow !text-(--clay)">{articleCategoryLabels[article.category]}</p>
          <h1 className="article-heading mt-3.5 text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.14] tracking-[-0.01em]">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[0.85rem] text-(--muted-strong)">
            <span>Published {publishedLabel}</span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-[#b9c4bc]" />
            <span>{minutes} min read</span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-[#b9c4bc]" />
            <span>Updated {updatedLabel}</span>
          </div>
        </div>
        <div className="mt-7 border-b border-(--line)" />
      </header>

      <div className="container-page grid gap-10 pb-6 pt-9 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <aside className="hidden lg:sticky lg:top-6 lg:block">
          {toc.length > 0 && (
            <div className="rounded-2xl border border-(--line) bg-(--surface)/95 p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.8)]">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow !text-(--muted-strong)">On this page</p>
                <p className="text-[0.72rem] font-semibold text-(--clay)">{minutes} min</p>
              </div>
              <ArticleTocNav entries={toc} />
            </div>
          )}
          <div className="mt-4 rounded-2xl border border-(--line) bg-(--moss-soft) p-5">
            <p className="eyebrow !text-(--moss)">Our data method</p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-[#334740]">
              Every reading and spelling on this site comes from structured dictionary records.
            </p>
            <Link
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-(--moss)"
              href="/about"
            >
              How we research names
              <svg
                aria-hidden="true"
                fill="none"
                height="12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.4"
                viewBox="0 0 24 24"
                width="12"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </aside>

        <article className="min-w-0">
          {toc.length > 0 && (
            <details className="mb-7 rounded-2xl border border-(--line) bg-(--surface)/95 p-5 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
                On this page · {toc.length} sections
                <span aria-hidden="true" className="text-xl leading-none text-(--clay)">+</span>
              </summary>
              <nav aria-label="Table of contents" className="mt-3 grid">
                {toc.map((entry) => (
                  <a
                    className="flex gap-2.5 py-1.5 text-[0.82rem] text-[#43504a]"
                    href={`#${entry.id}`}
                    key={entry.id}
                  >
                    <span className="pt-[2px] text-[0.66rem] font-extrabold text-(--clay)">
                      {entry.number}
                    </span>
                    {entry.label}
                  </a>
                ))}
              </nav>
            </details>
          )}

          <div className="max-w-3xl">
            {article.intro.map((paragraph, index) => (
              <p
                className={
                  index === 0
                    ? "article-dropcap text-lg leading-8 text-[#3f4b44]"
                    : "mt-5 text-lg leading-8 text-[#3f4b44]"
                }
                key={`intro-${index}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <ArticleRenderer blocks={article.blocks} />

          {article.faq.length > 0 && (
            <section className="mt-14 max-w-3xl scroll-mt-6" id="article-faq">
              <h2 className="article-heading text-[1.7rem] font-bold leading-tight sm:text-[1.8rem]">
                Questions and answers
              </h2>
              <div className="mt-5 grid gap-3">
                {article.faq.map((item, index) => (
                  <details
                    className="group rounded-2xl border border-(--line) bg-(--surface)/95 p-5"
                    key={item.question}
                    open={index === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="text-xl leading-none text-(--clay) transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[0.92rem] leading-7 text-(--muted-strong)">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-11 max-w-3xl rounded-2xl bg-(--moss-dark) p-6 sm:p-7">
            <p className="eyebrow !text-[#a7c4b5]">Our data method</p>
            <p className="article-heading mt-2.5 text-[1.4rem] font-bold leading-snug text-(--surface)">
              Evidence before interpretation
            </p>
            <p className="mt-2 max-w-xl text-[0.85rem] leading-6 text-(--surface)/80">
              Every name page shows its recorded spelling, reading, and entry ID — never an
              invented meaning.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                className="rounded-full bg-(--surface) px-5 py-2.5 text-[0.85rem] font-bold text-(--moss-dark)"
                href="/about"
              >
                Read the full data method
              </Link>
              <span className="text-[0.8rem] leading-6 text-(--surface)/75">
                Or explore the records:{" "}
                <Link className="font-bold text-(--surface) underline underline-offset-4" href="/#generator">
                  name generator
                </Link>
                ,{" "}
                <Link className="font-bold text-(--surface) underline underline-offset-4" href="/japanese-girl-names">
                  girl names
                </Link>
                ,{" "}
                <Link className="font-bold text-(--surface) underline underline-offset-4" href="/japanese-boy-names">
                  boy names
                </Link>
                ,{" "}
                <Link className="font-bold text-(--surface) underline underline-offset-4" href="/japanese-last-names">
                  surnames
                </Link>
              </span>
            </div>
          </section>
        </article>
      </div>

      {related.length > 0 && (
        <section className="border-y border-(--line) bg-[#efeee8] py-14">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Related guides</p>
                <h2 className="article-heading mt-2 text-3xl font-bold">Keep reading</h2>
              </div>
              <Link className="text-sm font-bold text-(--moss) underline underline-offset-4" href="/articles">
                All guides →
              </Link>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard article={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
