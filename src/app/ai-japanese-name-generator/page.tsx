import type { Metadata } from "next";
import Link from "next/link";
import { AINameGenerator } from "@/components/ai-name-generator/AINameGenerator";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Japanese Name Generator – Describe the Name You Want",
  description:
    "Describe the Japanese name you want and receive personalized, source-backed suggestions with kanji, readings, meanings, and careful match explanations.",
  alternates: { canonical: "/ai-japanese-name-generator" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "AI Japanese Name Generator – Describe the Name You Want",
    description:
      "Describe your ideal Japanese name and match it with source-backed kanji, readings, and meanings.",
    url: "/ai-japanese-name-generator",
  },
  twitter: {
    card: "summary",
    title: "AI Japanese Name Generator – Describe the Name You Want",
    description:
      "Describe your ideal Japanese name and receive personalized, source-backed suggestions.",
  },
};

const faq = [
  {
    question: "Does AI create the Japanese names?",
    answer:
      "No. AI only interprets the description. Every name, kanji spelling, reading, and displayed meaning comes from the site’s structured name records.",
  },
  {
    question: "What is a creative match?",
    answer:
      "A creative match connects a documented meaning or style with a mood such as elegant or mysterious. It is labeled separately and is not presented as a literal name meaning.",
  },
  {
    question: "What happens if the AI service is unavailable?",
    answer:
      "A local keyword parser can still recognize supported preferences such as gender, moon, fire, hope, modern, traditional, and character use.",
  },
  {
    question: "Are descriptions saved or sent to analytics?",
    answer:
      "The generator does not send the full description to analytics. Analytics receives only normalized fields such as gender, usage, themes, and result count.",
  },
];

export default function AIJapaneseNameGeneratorPage() {
  return (
    <div className="container-page themed-page theme-plum">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Japanese Name Generator", path: "/ai-japanese-name-generator" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "AI Japanese Name Generator",
              url: `${siteUrl}/ai-japanese-name-generator`,
              applicationCategory: "ReferenceApplication",
              operatingSystem: "Any",
              description:
                "A natural-language Japanese name tool that interprets preferences and recommends names from a structured local database.",
            },
            {
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />
      <Breadcrumbs items={[{ label: "AI Japanese Name Generator" }]} />
      <header className="page-intro my-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">Natural-language beta</p>
          <span className="rounded-full border border-[#cdbed0] bg-[#f7f2f8] px-2.5 py-1 text-[0.68rem] font-bold text-[#675169]">
            Database-backed
          </span>
        </div>
        <h1 className="section-title mt-2">AI Japanese Name Generator</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#59645d]">
          Describe the Japanese name you want and get personalized suggestions
          with kanji, kana readings, romaji, and meanings. AI interprets your
          idea; the existing structured Japanese name database generates and
          verifies every result.
        </p>
      </header>

      <AINameGenerator />

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 className="section-title mt-2 !text-3xl">
            Natural language in, structured records out
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Interpret", "The parser turns your description into a small, validated set of supported preferences."],
            ["2", "Match", "Local code searches real surname and given-name records, then ranks direct and creative matches."],
            ["3", "Explain", "Each result separates stored meaning evidence from cautious creative interpretation."],
          ].map(([number, title, copy]) => (
            <article className="surface p-5" key={number}>
              <span className="text-xs font-bold text-[#8b718d]">0{number}</span>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#647068]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <article>
          <p className="eyebrow">Different intent</p>
          <h2 className="section-title mt-2 !text-3xl">AI or manual filters?</h2>
          <p className="mt-4 leading-7 text-[#59645d]">
            Use this page when you have a mood, character, theme, or natural-language
            idea. If you already know the gender, style, meaning, or kanji you want,
            the standard generator gives you direct control over every filter.
          </p>
          <Link className="button-primary mt-5" href="/#generator">
            Use the standard Japanese Name Generator
          </Link>
        </article>
        <article>
          <p className="eyebrow">Reliability</p>
          <h2 className="section-title mt-2 !text-3xl">AI is not the name database</h2>
          <p className="mt-4 leading-7 text-[#59645d]">
            The model cannot add a name, invent a reading, assemble arbitrary
            kanji, or write a new meaning. Direct matches come from stored data.
            Mood-based creative matches are visibly labeled and should be treated
            as inspiration rather than literal linguistic claims.
          </p>
        </article>
      </section>

      <section className="mt-16">
        <p className="eyebrow">Browse instead</p>
        <h2 className="section-title mt-2 !text-3xl">Explore structured name lists</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="button-secondary" href="/japanese-girl-names">Japanese girl names</Link>
          <Link className="button-secondary" href="/japanese-boy-names">Japanese boy names</Link>
          <Link className="button-secondary" href="/japanese-last-names">Japanese last names</Link>
        </div>
      </section>

      <section className="mt-16">
        <p className="eyebrow">FAQ</p>
        <h2 className="section-title mt-2 !text-3xl">About AI-assisted recommendations</h2>
        <div className="mt-6 grid gap-3">
          {faq.map((item) => (
            <details className="surface group p-5" key={item.question}>
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold">
                {item.question}
                <span className="text-xl text-[#8b718d] group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[#647068]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
