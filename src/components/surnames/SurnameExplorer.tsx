"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import { trackEvent } from "@/lib/analytics";
import { BrowsePagination } from "@/components/shared/BrowsePagination";
import { BROWSE_PAGE_SIZE, type BrowseSurname } from "@/lib/browse";
import type { SurnameRecord } from "@/types/names";

// Render a substantial browseable set in the initial HTML without creating a
// detail URL for every source-backed database record.
const PAGE_SIZE = BROWSE_PAGE_SIZE;

// Lower sorts first: ranked surnames lead the default view, alphabetical as
// the tiebreaker so the eight ranked names surface before 200+ unranked ones.
const popularityOrder: Record<SurnameRecord["popularityLevel"], number> = {
  very_common: 0,
  common: 1,
  uncommon: 2,
  rare: 3,
  unranked: 4,
};

export function SurnameExplorer({ surnames, initialPage = 1 }: { surnames: BrowseSurname[]; initialPage?: number }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const [popularity, setPopularity] = useState("any");
  const [origin, setOrigin] = useState("any");
  const [region, setRegion] = useState("any");
  const [sort, setSort] = useState("common");
  const [localPage, setLocalPage] = useState(1);
  const [randomId, setRandomId] = useState<string>();

  const origins = [...new Set(surnames.flatMap((surname) => surname.originTypes))].sort();
  const availableLetters = [
    ...new Set(surnames.map((surname) => surname.romaji.charAt(0).toUpperCase())),
  ].sort();
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return surnames
      .filter((surname) => {
        if (
          normalized &&
          !`${surname.kanji} ${surname.romaji} ${surname.hiragana}`
            .toLowerCase()
            .includes(normalized)
        ) {
          return false;
        }
        if (letter !== "All" && !surname.romaji.toUpperCase().startsWith(letter)) return false;
        if (popularity !== "any") {
          if (popularity === "common" && !["very_common", "common"].includes(surname.popularityLevel)) return false;
          if (popularity !== "common" && surname.popularityLevel !== popularity) return false;
        }
        if (origin !== "any" && !surname.originTypes.includes(origin as SurnameRecord["originTypes"][number])) return false;
        if (region === "documented" && surname.regions.length === 0) return false;
        if (region === "not_available" && surname.regions.length > 0) return false;
        return true;
      })
      .sort((a, b) =>
        sort === "common"
          ? popularityOrder[a.popularityLevel] - popularityOrder[b.popularityLevel] ||
            a.romaji.localeCompare(b.romaji)
          : Number(b.isIndexable) - Number(a.isIndexable) || a.romaji.localeCompare(b.romaji),
      );
  }, [letter, origin, popularity, query, region, sort, surnames]);

  const hasFilters = Boolean(query.trim()) || letter !== "All" || popularity !== "any" || origin !== "any" || region !== "any";
  const page = Math.min(hasFilters ? localPage : initialPage, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
  const displayed = randomId
    ? filtered.filter((surname) => surname.id === randomId)
    : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section aria-labelledby="surname-results">
      <div
        className="surface p-5 sm:p-6"
        style={{ borderTop: "3px solid var(--page-accent, var(--moss))" }}
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 text-xs font-bold lg:col-span-2">
            Search Japanese last names
            <input
              className="field"
              onChange={(event) => {
                setQuery(event.target.value);
                setLocalPage(1);
                setRandomId(undefined);
                trackEvent("search_surnames", {
                  queryLength: [...event.target.value].length,
                });
              }}
              placeholder="Search Kanji, Romaji, or Hiragana"
              type="search"
              value={query}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Sort
            <select className="field" onChange={(event) => { setSort(event.target.value); setLocalPage(1); setRandomId(undefined); }} value={sort}>
              <option value="common">Most common first</option>
              <option value="alpha">A to Z</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Commonness
            <select className="field" onChange={(event) => { setPopularity(event.target.value); setLocalPage(1); setRandomId(undefined); }} value={popularity}>
              <option value="any">Any commonness</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Origin type
            <select className="field capitalize" onChange={(event) => { setOrigin(event.target.value); setLocalPage(1); setRandomId(undefined); }} value={origin}>
              <option value="any">Any origin</option>
              {origins.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Regional evidence
            <select className="field" onChange={(event) => { setRegion(event.target.value); setLocalPage(1); setRandomId(undefined); }} value={region}>
              <option value="any">Any</option>
              <option value="documented">Documented distribution</option>
              <option value="not_available">Not yet available</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              className="button-secondary w-full"
              disabled={filtered.length === 0}
              onClick={() => {
                const picked = filtered[Math.floor(Math.random() * filtered.length)];
                setRandomId(picked?.id);
              }}
              type="button"
            >
              Pick a random surname
            </button>
          </div>
          {randomId && (
            <div className="flex items-end">
              <button className="button-quiet" onClick={() => setRandomId(undefined)} type="button">
                Show all matches
              </button>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Browse by first letter">
          {["All", ...availableLetters].map((item) => (
            <button
              aria-pressed={letter === item}
              className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                letter === item ? "bg-(--moss) text-white" : "bg-[#efefe9] text-(--muted-strong)"
              }`}
              key={item}
              onClick={() => {
                setLetter(item);
                setLocalPage(1);
                setRandomId(undefined);
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <h2 className="section-title !text-2xl" id="surname-results">Japanese family names</h2>
        <span className="text-sm text-(--muted)">{filtered.length} matches</span>
      </div>
      {displayed.length ? (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayed.map((surname) => (
              <article className="surface flex flex-col p-5" key={surname.id}>
                {/* Kanji spelling is the anchor; the romanized form becomes a
                    secondary line and chips appear only when they carry
                    information (ranked popularity, origin types). */}
                <div className="flex items-center justify-end gap-2">
                  <PronunciationButton
                    label={surname.romaji}
                    text={surname.hiragana}
                  />
                  <CopyButton
                    compact
                    eventName="copy_surname"
                    label={`Copy ${surname.romaji}`}
                    text={`${surname.kanji} — ${surname.romaji} — ${surname.hiragana}`}
                  />
                  <FavoriteButton
                    compact
                    item={{
                      id: `surname:${surname.id}`,
                      kind: "surname",
                      label: `${surname.kanji} · ${surname.romaji}`,
                      sublabel: surname.literalMeaning,
                      pronunciation: surname.hiragana,
                      href: surname.isIndexable ? `/surname/${surname.slug}` : "/japanese-last-names",
                    }}
                  />
                </div>
                <p className="japanese-display -mt-1 text-[1.9rem] font-bold leading-[1.25]">
                  {surname.isIndexable ? (
                    <Link
                      href={`/surname/${surname.slug}`}
                      title={`Read the ${surname.romaji} surname story`}
                    >
                      {surname.kanji}
                    </Link>
                  ) : (
                    surname.kanji
                  )}
                </p>
                <p className="mt-1 text-[0.88rem]">
                  <strong className="font-bold tracking-[-0.01em]">{surname.romaji}</strong>{" "}
                  <span className="japanese-display text-[0.8rem] text-(--muted)">
                    · {surname.hiragana}
                  </span>
                </p>
                <p className="mt-2.5 text-[0.82rem] leading-relaxed text-(--muted-strong)">
                  {surname.literalMeaning}
                </p>
                <div className="mb-5 mt-3 flex flex-wrap gap-1.5">
                  {surname.popularityLevel !== "unranked" && (
                    <span className="chip !border-(--sage) !bg-(--moss-soft) !text-(--moss) capitalize">
                      {surname.popularityLevel.replace("_", " ")}
                    </span>
                  )}
                  {surname.originTypes.slice(0, 2).map((item) => <span className="chip capitalize" key={item}>{item}</span>)}
                </div>
                <div className="mt-auto flex flex-wrap gap-4 border-t border-(--line-soft) pt-4 text-xs font-bold text-(--moss)">
                  {surname.isIndexable && (
                    <Link href={`/surname/${surname.slug}`} onClick={() => trackEvent("open_surname", { id: surname.id })}>
                      View surname story →
                    </Link>
                  )}
                  {!surname.isIndexable && (
                    <span className="font-medium text-(--muted-soft)" title="The source record supports the spelling and reading; no family-origin claim is inferred from kanji alone.">
                      Origin not inferred from kanji
                    </span>
                  )}
                  <Link href={`/?surname=${surname.id}#generator`}>Use in generator</Link>
                </div>
              </article>
            ))}
          </div>
          {!randomId && <BrowsePagination basePath="/japanese-last-names" page={page} count={filtered.length}
            filtered={hasFilters} onPageChange={setLocalPage} />}
        </>
      ) : (
        <div className="surface mt-4 py-12 text-center">
          <p className="font-semibold">No surnames match these filters.</p>
          <button
            className="button-secondary mt-4"
            onClick={() => {
              setQuery("");
              setLetter("All");
              setPopularity("any");
              setOrigin("any");
              setRegion("any");
              setRandomId(undefined);
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
