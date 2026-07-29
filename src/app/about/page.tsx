import type { Metadata } from "next";
import { SourceList } from "@/components/shared/SourceList";
import { sources } from "@/data";

export const metadata: Metadata = {
  title: "About the Japanese Names Data",
  description:
    "Learn how Japanese Names separates structured name records, literal meanings, common interpretations, historical claims, and editorial review status.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About the Japanese Names Data",
    description: "How Japanese Names labels evidence, uncertainty, and editorial status.",
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "About the Japanese Names Data",
    description: "How Japanese Names labels evidence, uncertainty, and editorial status.",
  },
};

export default function AboutPage() {
  return (
    <div className="container-page themed-page theme-gold">
      <header className="page-intro my-6">
        <p className="eyebrow">Method and limits</p>
        <h1 className="section-title mt-2">Names deserve better than plausible-sounding guesses</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59645d]">
          Japanese Names is a structured reference and generation tool. It
          combines only stored surname records, given-name readings, and kanji
          variations—never an on-demand language model.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Verified records", "Core reading and spelling fields have completed the current editorial source check."],
          ["Partially verified", "Basic data is usable, while deeper historical or distribution claims remain limited."],
          ["Needs review", "The entry stays out of search indexing and the sitemap until its required fields are reviewed."],
        ].map(([title, text]) => (
          <article className="surface p-6" key={title}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#647068]">{text}</p>
          </article>
        ))}
      </section>
      <section className="mt-16 max-w-4xl">
        <h2 className="section-title !text-3xl">What confidence labels mean</h2>
        <p className="mt-4 leading-7 text-[#59645d]">
          A literal kanji interpretation is not automatically an origin story.
          We separately label well-documented material, common interpretations,
          multiple possible origins, literal-only readings, and uncertainty.
          No label implies that every person with the same surname shares one ancestor.
        </p>
      </section>
      <section className="mt-16">
        <h2 className="section-title !text-3xl">Reference starting points</h2>
        <p className="mb-6 mt-4 max-w-3xl text-sm leading-6 text-[#647068]">
          These institutional references establish system history, research
          method, or standard character readings. Individual surname histories
          need additional surname-specific sources before deeper claims are added.
        </p>
        <SourceList sources={sources} />
      </section>
    </div>
  );
}
