import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import { SourceList } from "@/components/shared/SourceList";
import { firstNames, sourceById, surnameById } from "@/data";
import { getIndexableSurnames, getFirstNameBySlug } from "@/lib/names";
import { nameNotes } from "@/data/name-notes";
import { getMeaningPreview } from "@/lib/name-display";
import { breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return firstNames.filter((name) => name.isIndexable).map((name) => ({ slug: name.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = getFirstNameBySlug(slug);
  if (!name) return {};
  const title = `${name.romaji} Japanese Name Meaning, Kanji and Hiragana`;
  const description = `Explore the Japanese name ${name.romaji} (${name.hiragana}), its stored kanji variations, character meanings, pronunciation, and full-name pairings.`;
  return {
    title,
    description,
    alternates: { canonical: `/name/${name.slug}` },
    robots: name.isIndexable && name.verificationStatus !== "needs_review"
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: { title, description, url: `/name/${name.slug}` },
    twitter: { card: "summary", title, description },
  };
}

export default async function FirstNamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = getFirstNameBySlug(slug);
  if (!name) notFound();
  const compatibleSurnames = name.compatibleSurnameIds
    .map((id) => surnameById.get(id))
    .filter((item) => item !== undefined)
    .slice(0, 6);
  const usesExamplePairings = compatibleSurnames.length === 0;
  const surnames = usesExamplePairings
    ? getIndexableSurnames().slice(0, 6)
    : compatibleSurnames;
  const nameKanji = new Set(name.variations.flatMap((v) => [...v.kanji]));
  const relatedNames = firstNames
    .filter((item) => item.isIndexable && item.id !== name.id)
    .filter((item) =>
      item.variations.some((variation) =>
        [...variation.kanji].some((k) => nameKanji.has(k)),
      ),
    )
    .sort((a, b) => a.romaji.localeCompare(b.romaji, "en"))
    .slice(0, 8);
  const sourceList = name.sourceIds
    .map((id) => sourceById.get(id))
    .filter((item) => item !== undefined);
  const preferred = name.variations[0];
  const themeClass =
    name.genders.length > 1
      ? "theme-plum"
      : name.genders.includes("girl")
        ? "theme-sakura"
        : "theme-indigo";

  return (
    <div className={`container-page themed-page ${themeClass}`}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "First Names", path: name.genders.includes("girl") ? "/japanese-girl-names" : "/japanese-boy-names" },
          { name: name.romaji, path: `/name/${name.slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          {
            label: name.genders.includes("girl") ? "Japanese Girl Names" : "Japanese Boy Names",
            href: name.genders.includes("girl") ? "/japanese-girl-names" : "/japanese-boy-names",
          },
          { label: name.romaji },
        ]}
      />
      <header className="page-intro my-6 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <div>
          {name.verificationStatus === "needs_review" && (
            <p className="mb-4 inline-flex rounded-full bg-[#f4e9e5] px-3 py-1 text-xs font-bold text-[#843c2f]">
              This record still needs review
            </p>
          )}
          {!name.isIndexable && name.candidateStatus && (
            <p className="mb-4 inline-flex rounded-full bg-[#edf0eb] px-3 py-1 text-xs font-bold text-[#536058]">
              Dictionary spelling and reading
            </p>
          )}
          <p className="eyebrow">Japanese given name</p>
          <div className="mt-3 flex items-end gap-5">
            <h1 className="text-4xl font-semibold sm:text-5xl">{name.romaji}: Meaning &amp; Kanji</h1>
            <span className="seal mb-2" aria-hidden="true">名</span>
          </div>
          <p className="japanese-display mt-4 text-5xl">{preferred.kanji}</p>
          <p className="japanese-display mt-1 text-base text-[#647068]">
            {name.hiragana}{name.katakana ? ` · ${name.katakana}` : ""}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <CopyButton text={`${preferred.kanji} · ${name.romaji} · ${name.hiragana}`} />
            <FavoriteButton
              item={{
                id: `first:${name.id}`,
                kind: "first_name",
                label: `${preferred.kanji} · ${name.romaji}`,
                sublabel: name.hiragana,
                pronunciation: name.hiragana,
                href: `/name/${name.slug}`,
              }}
            />
            <PronunciationButton label={name.romaji} text={name.hiragana} />
            <Link className="button-primary" href={`/?firstName=${name.id}#generator`}>
              Generate a full name
            </Link>
          </div>
        </div>
        <dl className="surface grid gap-3 p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Gender in this collection</dt>
            <dd className="font-semibold capitalize">{name.genders.join(", ")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Stored reading</dt>
            <dd className="font-semibold">{name.hiragana} ({name.romaji})</dd>
          </div>
        </dl>
      </header>

      {nameNotes[name.slug] && <section className="max-w-3xl py-8">
        <h2 className="text-2xl font-semibold">What does {name.romaji} mean in this spelling?</h2>
        <p className="mt-4 leading-7 text-[#59645d]">{nameNotes[name.slug]}</p>
        <p className="mt-3 text-sm leading-6 text-[#647068]">These are written-form explanations. Style and gender labels describe this collection; they are not a current usage survey or a guarantee of suitability.</p>
      </section>}
      <section className="py-12">
        <p className="eyebrow">Written forms</p>
        <h2 className="section-title mb-6 mt-2">Kanji variations for {name.romaji}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {name.variations.map((variation) => (
            <article className="surface p-6" key={variation.kanji}>
              <div className="flex items-start justify-between gap-4">
                <p className="japanese-display text-5xl">{variation.kanji}</p>
                <span className="chip capitalize">{variation.meaningEvidence === "dictionary_glosses" ? "Dictionary record" : "Editorial selection"}</span>
              </div>
              <p className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
                {variation.meaningEvidence === "dictionary_glosses"
                  ? "Kanji component glosses"
                  : "Written-form notes"}
              </p>
              <p className="mt-2 font-semibold">{getMeaningPreview(variation)}</p>
              <p className="mt-3 text-xs leading-5 text-[#647068]">
                {variation.upstreamIds?.length
                  ? `Spelling and reading recorded in JMnedict (2026-08-01 snapshot), entry ${variation.upstreamIds.join(", ")}. This does not establish popularity or naming intention.`
                  : "No exact spelling-and-reading match was found in our JMnedict snapshot. This does not establish that the form is invalid; seek an additional name-specific reference before relying on it."}
              </p>
              <dl className="mt-5 grid gap-2 border-t border-[#e3e2dc] pt-4">
                {variation.kanjiBreakdown.map((part) => (
                  <div className="flex items-center justify-between text-sm" key={part.kanji}>
                    <dt className="japanese-display text-lg font-semibold">{part.kanji}</dt>
                    <dd className="text-right text-[#647068]">{part.meanings.join(", ")}</dd>
                  </div>
                ))}
              </dl>
              {variation.verificationStatus !== "verified" && (
                <p className="mt-4 rounded-lg bg-[#f4e9e5] p-3 text-xs leading-5 text-[#6d5048]">
                  {variation.meaningEvidence === "dictionary_glosses"
                    ? "JMnedict documents this spelling-reading pair. KANJIDIC2 supplies the component glosses; they do not prove a combined meaning, popularity, or current naming style."
                    : `This variation is ${variation.verificationStatus.replace("_", " ")}. Confirm current real-world usage before choosing it.`}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <p className="eyebrow">Full-name pairings</p>
        <h2 className="section-title mb-6 mt-2">Surnames to pair with {name.romaji}</h2>
        {usesExamplePairings && (
          <p className="mb-6 max-w-3xl text-sm leading-6 text-[#647068]">
            Reviewed pairings for {name.romaji} are not yet recorded, so the
            examples below use frequently requested surnames from this
            collection. Any given name can precede a Japanese family name.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surnames.map((surname) => (
            <Link
              className="surface p-4"
              href={`/?surname=${surname.id}&firstName=${name.id}#generator`}
              key={surname.id}
            >
              <span className="japanese-display block text-xl font-semibold">
                {surname.kanji} {preferred.kanji}
              </span>
              <span className="mt-1 block text-sm text-[#647068]">
                {surname.romaji} {name.romaji}
              </span>
              <span className="mt-3 block text-xs font-bold text-[#315c4b]">Use this pairing →</span>
            </Link>
          ))}
        </div>
      </section>

      {relatedNames.length > 0 && (
        <section className="py-12">
          <p className="eyebrow">Related names</p>
          <h2 className="section-title mb-6 mt-2">Names that share a kanji with {name.romaji}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relatedNames.map((item) => {
              const sharedKanji = [...nameKanji]
                .filter((k) => item.variations.some((variation) => variation.kanji.includes(k)))
                .join("");
              return (
                <Link
                  className="surface p-4 transition hover:border-[#aac0b1]"
                  href={`/name/${item.slug}`}
                  key={item.id}
                >
                  <span className="japanese-display block text-2xl font-semibold">
                    {item.variations[0].kanji}
                  </span>
                  <span className="mt-1 block text-sm text-[#647068]">{item.romaji}</span>
                  <span className="mt-3 block text-xs font-bold text-[#315c4b]">
                    Shares {sharedKanji} →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="py-12">
        <p className="eyebrow">Evidence trail</p>
        <h2 className="section-title mb-3 mt-2">Sources</h2>
        <p className="mb-6 max-w-3xl text-sm leading-6 text-[#647068]">
          Kanji glosses help explain the written form. They are not a claim
          about the personality or destiny of a person who uses the name.
          The Jōyō Kanji reference is general character background; it does not
          verify every personal-name reading or establish popularity. Imported
          records cite their dictionary sources separately.
        </p>
        <SourceList sources={sourceList} />
      </section>
    </div>
  );
}
