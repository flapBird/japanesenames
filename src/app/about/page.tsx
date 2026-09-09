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
        <h1 className="section-title mt-2">How to read our name records</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59645d]">
          Japanese Names is a structured reference and generation tool. It
          combines only stored surname records, given-name readings, and kanji
          variations. The standard generator uses local records; the optional AI-assisted tool interprets preferences and retrieves from the same records.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Source-recorded pairs", "JMnedict documents a stored spelling-and-reading pair and the original name classification."],
          ["Dictionary-supported glosses", "KANJIDIC2 supports character-level glosses without asserting one combined personal-name meaning."],
          ["Editorially reviewed context", "Expanded entries add editorial explanations of written forms or surname context. These explanations are not a current usage survey."],
        ].map(([title, text]) => (
          <article className="surface p-6" key={title}>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#647068]">{text}</p>
          </article>
        ))}
      </section>
      <section className="mt-16 max-w-4xl">
        <h2 className="section-title !text-3xl">What each source establishes</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="surface p-6">
            <h3 className="font-semibold">JMnedict</h3>
            <p className="mt-3 text-sm leading-6 text-[#647068]">
              Supports the recorded kanji spelling, reading, and source
              classification. Each imported production record preserves its
              upstream entry ID.
            </p>
          </article>
          <article className="surface p-6">
            <h3 className="font-semibold">KANJIDIC2</h3>
            <p className="mt-3 text-sm leading-6 text-[#647068]">
              Supports individual character glosses. These glosses are shown as
              components, not as proof of a person&apos;s intended name meaning,
              popularity, style, or family history.
            </p>
          </article>
        </div>
        <p className="mt-5 text-sm leading-6 text-[#647068]">
          Source-backed dictionary records remain outside the sitemap until a
          detail page has enough editorial context to stand on its own. They can
          still support generator breadth because their spelling and reading are
          directly documented.
        </p>
      </section>
      <section className="mt-16 max-w-4xl">
        <h2 className="section-title !text-3xl">Editorial guidance and evidence</h2>
        <p className="mt-4 leading-7 text-[#59645d]">Editorial selection describes our browsing order, not a popularity ranking. Style, naturalness, and usage estimates are editorial guidance unless a specific supporting source is given. The general Jōyō Kanji table does not verify every personal-name reading, gender association, or frequency of use.</p>
        <p className="mt-4 leading-7 text-[#59645d]">Dictionary glosses can include senses used in abbreviations or unrelated contexts. We keep those senses in character notes rather than joining them into an asserted name meaning. A spelling-and-reading record is evidence that a dictionary records the pair, not evidence of a particular person’s naming intention.</p>
        <p className="mt-4 text-sm text-[#647068]">Display method updated September 9, 2026: separated general character glosses from name meanings and labeled editorial usage estimates.</p>
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
          These references establish recorded name pairs, character glosses,
          system history, research method, or standard character readings.
          Individual surname histories need additional surname-specific sources
          before deeper claims are added.
        </p>
        <SourceList sources={sources} />
      </section>
    </div>
  );
}
