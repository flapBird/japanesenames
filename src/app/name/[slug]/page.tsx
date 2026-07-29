import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { JsonLd } from "@/components/shared/JsonLd";
import { SourceList } from "@/components/shared/SourceList";
import { firstNames, sourceById, surnameById } from "@/data";
import { getFirstNameBySlug } from "@/lib/names";
import { breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return firstNames.map((name) => ({ slug: name.slug }));
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
  const description = `Explore the Japanese name ${name.romaji} (${name.hiragana}), its common kanji variations, spelling-specific meanings, gender tendency, style, and full-name pairings.`;
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
  const surnames = name.compatibleSurnameIds
    .map((id) => surnameById.get(id))
    .filter((item) => item !== undefined)
    .slice(0, 6);
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
              Editorial review incomplete · not indexed
            </p>
          )}
          <p className="eyebrow">Japanese given name</p>
          <div className="mt-3 flex items-end gap-5">
            <h1 className="japanese-display text-7xl font-medium sm:text-8xl">{preferred.kanji}</h1>
            <span className="seal mb-2" aria-hidden="true">名</span>
          </div>
          <p className="mt-4 text-2xl font-semibold">{name.romaji}</p>
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
                href: `/name/${name.slug}`,
              }}
            />
            <Link className="button-primary" href={`/?firstName=${name.id}#generator`}>
              Generate a full name
            </Link>
          </div>
        </div>
        <dl className="surface grid gap-3 p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Gender tendency</dt>
            <dd className="font-semibold capitalize">{name.genders.join(", ")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Style</dt>
            <dd className="font-semibold capitalize">{name.styles.join(", ")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Commonness</dt>
            <dd className="font-semibold capitalize">{name.popularityLevel.replace("_", " ")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#647068]">Common reading</dt>
            <dd className="font-semibold">{name.hiragana} ({name.romaji})</dd>
          </div>
        </dl>
      </header>

      <section className="py-12">
        <p className="eyebrow">Written forms</p>
        <h2 className="section-title mb-6 mt-2">Kanji variations for {name.romaji}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {name.variations.map((variation) => (
            <article className="surface p-6" key={variation.kanji}>
              <div className="flex items-start justify-between gap-4">
                <p className="japanese-display text-5xl">{variation.kanji}</p>
                <span className="chip capitalize">{variation.naturalness.replace("_", "-")}</span>
              </div>
              <p className="mt-5 font-semibold">{variation.meanings.join("; ")}</p>
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
                  This variation is {variation.verificationStatus.replace("_", " ")}.
                  Confirm current real-world usage before choosing it.
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <p className="eyebrow">Full-name pairings</p>
        <h2 className="section-title mb-6 mt-2">Surnames to pair with {name.romaji}</h2>
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

      <section className="py-12">
        <p className="eyebrow">Evidence trail</p>
        <h2 className="section-title mb-3 mt-2">Sources</h2>
        <p className="mb-6 max-w-3xl text-sm leading-6 text-[#647068]">
          Kanji glosses help explain the written form. They are not a claim
          about the personality or destiny of a person who uses the name.
        </p>
        <SourceList sources={sourceList} />
      </section>
    </div>
  );
}
