import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CompatibleNames } from "@/components/surnames/CompatibleNames";
import { JapanPrefectureMap } from "@/components/surnames/JapanPrefectureMap";
import { KanjiBreakdown } from "@/components/surnames/KanjiBreakdown";
import { OriginConfidenceBadge } from "@/components/surnames/OriginConfidenceBadge";
import { OriginIllustration } from "@/components/surnames/OriginIllustration";
import { SurnameTimeline } from "@/components/surnames/SurnameTimeline";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import { SourceList } from "@/components/shared/SourceList";
import { firstNameById, sourceById, surnames } from "@/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getSurnameBySlug } from "@/lib/names";

export function generateStaticParams() {
  return surnames.filter((surname) => surname.isIndexable).map((surname) => ({ slug: surname.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const surname = getSurnameBySlug(slug);
  if (!surname) return {};
  const title = `${surname.romaji} (${surname.kanji}) Surname Meaning and Origin`;
  const description = `${surname.romaji} is written ${surname.kanji} (${surname.hiragana}). Explore its literal meaning, kanji breakdown, origin confidence, history, and sources.`;
  return {
    title,
    description,
    alternates: { canonical: `/surname/${surname.slug}` },
    robots: surname.isIndexable && surname.verificationStatus !== "needs_review"
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: { title, description, url: `/surname/${surname.slug}` },
    twitter: { card: "summary", title, description },
  };
}

export default async function SurnamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const surname = getSurnameBySlug(slug);
  if (!surname) notFound();
  const compatibleNames = surname.compatibleFirstNameIds
    .map((id) => firstNameById.get(id))
    .filter((item) => item !== undefined);
  const sourceList = surname.sourceIds
    .map((id) => sourceById.get(id))
    .filter((item) => item !== undefined);

  return (
    <div className="container-page themed-page theme-moss">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Japanese Last Names", path: "/japanese-last-names" },
          { name: surname.romaji, path: `/surname/${surname.slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Japanese Last Names", href: "/japanese-last-names" },
          { label: surname.romaji },
        ]}
      />
      <header className="page-intro my-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div>
          {surname.verificationStatus === "needs_review" && (
            <p className="mb-4 inline-flex rounded-full bg-[#f4e9e5] px-3 py-1 text-xs font-bold text-[#843c2f]">
              Editorial review incomplete · not indexed
            </p>
          )}
          {!surname.isIndexable && surname.candidateStatus && (
            <p className="mb-4 inline-flex rounded-full bg-[#edf0eb] px-3 py-1 text-xs font-bold text-[#536058]">
              Source-backed dictionary record · not indexed
            </p>
          )}
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Japanese surname</p>
            <span className="seal" aria-hidden="true">姓</span>
          </div>
          <div className="mt-4 grid overflow-hidden rounded-2xl border border-[#d9ddd6] bg-[#fffefb] sm:grid-cols-2">
            <div className="min-w-0 bg-[#faf9f5] p-5 sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-[#747d77]">
                Romanized surname
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
                {surname.romaji}
              </h1>
            </div>
            <div className="min-w-0 border-t border-[#d9ddd6] p-5 sm:border-t-0 sm:border-l sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-[#747d77]">
                Japanese surname
              </p>
              <p className="japanese-display mt-3 text-5xl font-medium leading-tight sm:text-6xl">
                {surname.kanji}
              </p>
              <p className="japanese-display mt-2 text-sm text-[#647068] sm:text-base">
                {surname.hiragana} · {surname.katakana}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <CopyButton
              label="Copy"
              text={`${surname.kanji} · ${surname.romaji} · ${surname.hiragana}`}
            />
            <FavoriteButton
              item={{
                id: `surname:${surname.id}`,
                kind: "surname",
                label: `${surname.kanji} · ${surname.romaji}`,
                sublabel: surname.literalMeaning,
                pronunciation: surname.hiragana,
                href: `/surname/${surname.slug}`,
              }}
            />
            <PronunciationButton
              label={surname.romaji}
              text={surname.hiragana}
            />
            <Link className="button-primary" href={`/?surname=${surname.id}#generator`}>
              Generate with this surname
            </Link>
          </div>
        </div>
        <dl className="surface grid gap-3 p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Meaning</dt>
            <dd className="text-right font-semibold">{surname.literalMeaning}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Data status</dt>
            <dd className="font-semibold capitalize">{surname.verificationStatus.replace("_", " ")}</dd>
          </div>
        </dl>
      </header>

      <section className="py-12">
        <p className="eyebrow">Kanji breakdown</p>
        <h2 className="section-title mb-6 mt-2">See how the written form is built</h2>
        <KanjiBreakdown
          breakdown={surname.kanjiBreakdown}
          kanji={surname.kanji}
          literalMeaning={surname.literalMeaning}
        />
      </section>

      <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Origin landscape</p>
          <h2 className="section-title mb-6 mt-2">A visual reading of the surname</h2>
          <OriginIllustration illustrationKey={surname.originIllustrationKey} />
        </div>
        <div className="lg:pt-16">
          <OriginConfidenceBadge confidence={surname.originConfidence} />
          <p className="mt-5 text-base leading-7 text-[#59645d]">{surname.summary}</p>
          <p className="mt-3 text-sm leading-6 text-[#747b76]">
            This interpretation does not mean that everyone with this surname
            shares one ancestor or one place of origin.
          </p>
        </div>
      </section>

      <section className="py-12">
        <p className="eyebrow">Regional evidence</p>
        <h2 className="section-title mb-6 mt-2">Distribution across Japan</h2>
        <JapanPrefectureMap regions={surname.regions} />
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#647068]">
          <span className="chip">Green · modern population distribution</span>
          <span className="chip">Red · possible historical origin</span>
          <span className="chip">Literal inference is never mapped</span>
        </div>
      </section>

      <section className="py-12">
        <p className="eyebrow">Historical context</p>
        <h2 className="section-title mb-6 mt-2">Japanese surname timeline</h2>
        <SurnameTimeline timeline={surname.timeline} />
      </section>

      <section className="py-12">
        <p className="eyebrow">Natural pairings</p>
        <h2 className="section-title mb-6 mt-2">First names to pair with {surname.romaji}</h2>
        <CompatibleNames names={compatibleNames} surname={surname} />
      </section>

      <section className="py-12" aria-labelledby="sources-heading">
        <p className="eyebrow">Evidence trail</p>
        <h2 className="section-title mb-3 mt-2" id="sources-heading">Sources</h2>
        <p className="mb-6 max-w-3xl text-sm leading-6 text-[#647068]">
          These references support general name-system history, kanji readings,
          or the research method. They do not all establish one family lineage.
        </p>
        <SourceList sources={sourceList} />
      </section>
    </div>
  );
}
