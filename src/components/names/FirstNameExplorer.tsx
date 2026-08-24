"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import { trackEvent } from "@/lib/analytics";
import { getMeaningPreview } from "@/lib/name-display";
import type { FirstNameRecord, Gender } from "@/types/names";

// Client components are still server-rendered by Next.js. Keeping the first
// 24 records visible makes each hub useful in its initial HTML while filters
// and progressive loading remain client-side enhancements.
const PAGE_SIZE = 24;

export function FirstNameExplorer({
  names,
  gender,
}: {
  names: FirstNameRecord[];
  gender: Extract<Gender, "girl" | "boy">;
}) {
  const [letter, setLetter] = useState("All");
  const [meaning, setMeaning] = useState("any");
  const [style, setStyle] = useState("any");
  const [popularity, setPopularity] = useState("any");
  const [length, setLength] = useState("any");
  const [sort, setSort] = useState("popularity");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const meaningOptions = useMemo(
    () => [...new Set(names.flatMap((name) => name.meaningTags))].sort(),
    [names],
  );
  const availableLetters = useMemo(
    () =>
      [...new Set(names.map((name) => name.romaji.charAt(0).toUpperCase()))].sort(),
    [names],
  );
  const activeFilterCount = [
    meaning,
    style,
    popularity,
    length,
  ].filter((value) => value !== "any").length;
  const hasActiveSettings =
    activeFilterCount > 0 || letter !== "All" || sort !== "popularity";

  const filtered = useMemo(() => {
    const result = names.filter((name) => {
      if (letter !== "All" && !name.romaji.toUpperCase().startsWith(letter)) return false;
      if (meaning !== "any" && !name.meaningTags.includes(meaning)) return false;
      if (style !== "any" && !name.styles.includes(style as "modern" | "traditional" | "timeless")) return false;
      if (popularity !== "any" && name.popularityLevel !== popularity) return false;
      if (length !== "any" && !name.kanjiLengthOptions.includes(Number(length))) return false;
      return true;
    });
    return result.sort((a, b) => {
      if (sort === "popularity") {
        const rank = { very_common: 0, common: 1, uncommon: 2, rare: 3, unranked: 4 };
        return rank[a.popularityLevel] - rank[b.popularityLevel];
      }
      if (sort === "kanji_length") {
        return a.kanjiLengthOptions[0] - b.kanjiLengthOptions[0];
      }
      return a.romaji.localeCompare(b.romaji);
    });
  }, [length, letter, meaning, names, popularity, sort, style]);

  function clearFilters() {
    setLetter("All");
    setMeaning("any");
    setStyle("any");
    setPopularity("any");
    setLength("any");
    setSort("popularity");
    setVisible(PAGE_SIZE);
  }

  return (
    <section aria-labelledby="browse-heading">
      <div className="surface p-3 sm:p-4">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
          <label className="grid gap-1.5 text-[0.7rem] font-bold">
            Meaning theme
            <select
              className="field capitalize"
              onChange={(event) => {
                setMeaning(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              value={meaning}
            >
              <option value="any">Any meaning</option>
              {meaningOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-[0.7rem] font-bold">
            Era and style
            <select
              className="field"
              onChange={(event) => {
                setStyle(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              value={style}
            >
              <option value="any">Any style</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="timeless">Timeless</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-[0.7rem] font-bold">
            Commonness
            <select
              className="field"
              onChange={(event) => {
                setPopularity(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              value={popularity}
            >
              <option value="any">Any commonness</option>
              <option value="very_common">Popular</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-[0.7rem] font-bold">
            Written length
            <select
              className="field"
              onChange={(event) => {
                setLength(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              value={length}
            >
              <option value="any">Any length</option>
              <option value="1">1 Kanji</option>
              <option value="2">2 Kanji</option>
              <option value="3">3 Kanji</option>
            </select>
          </label>
          <label className="col-span-2 grid gap-1.5 text-[0.7rem] font-bold lg:col-span-1">
            Sort results
            <select
              className="field"
              onChange={(event) => setSort(event.target.value)}
              value={sort}
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="popularity">Most common first</option>
              <option value="kanji_length">Shortest Kanji first</option>
            </select>
          </label>
          <div className="col-span-2 flex items-end lg:col-span-1">
            <button
              className="button-secondary w-full !min-h-[2.55rem] !px-3 !text-sm"
              disabled={!hasActiveSettings}
              onClick={clearFilters}
              type="button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto border-t border-[#e3e2dc] pt-3 pb-1" aria-label="Browse by first letter">
          <span className="shrink-0 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
            Initial
          </span>
          {["All", ...availableLetters].map((item) => (
            <button
              aria-pressed={letter === item}
              className={`grid h-8 shrink-0 place-items-center rounded-full px-2.5 text-xs font-bold ${
                letter === item ? "bg-[#315c4b] text-white" : "bg-[#efefe9] text-[#59645d]"
              }`}
              key={item}
              onClick={() => {
                setLetter(item);
                setVisible(PAGE_SIZE);
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="section-title !text-2xl" id="browse-heading">
          {gender === "girl" ? "Japanese girl names" : "Japanese boy names"}
        </h2>
        <span className="text-sm text-[#647068]">{filtered.length} matches</span>
      </div>
      {filtered.length ? (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, visible).map((name) => {
              const variation = name.variations[0];
              const usesDictionaryGlosses =
                variation.meaningEvidence === "dictionary_glosses";
              return (
                <article className="surface flex flex-col p-5" key={name.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[#747d77]">
                      Given name formats
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      <PronunciationButton
                        label={name.romaji}
                        text={name.hiragana}
                      />
                      <CopyButton
                        compact
                        eventName="copy_first_name"
                        label={`Copy ${name.romaji}`}
                        text={`${variation.kanji} — ${name.romaji} — ${name.hiragana}`}
                      />
                      <FavoriteButton
                        compact
                        eventName="favorite_full_name"
                        item={{
                          id: `first:${name.id}`,
                          kind: "first_name",
                          label: `${variation.kanji} · ${name.romaji}`,
                          sublabel: name.hiragana,
                          pronunciation: name.hiragana,
                          href: name.isIndexable
                            ? `/name/${name.slug}`
                            : gender === "girl"
                              ? "/japanese-girl-names"
                              : "/japanese-boy-names",
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[#e3e2dc]">
                    <div className="min-w-0 bg-[#faf9f5] p-3.5">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
                        Romanized form
                      </p>
                      {name.isIndexable ? (
                        <Link
                          className="mt-2 block text-xl font-semibold leading-tight tracking-[-0.02em]"
                          href={`/name/${name.slug}`}
                        >
                          {name.romaji}
                        </Link>
                      ) : (
                        <p className="mt-2 text-xl font-semibold leading-tight tracking-[-0.02em]">
                          {name.romaji}
                        </p>
                      )}
                    </div>
                    <div className="min-w-0 border-l border-[#e3e2dc] p-3.5">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
                        Japanese form
                      </p>
                      {name.isIndexable ? (
                        <Link
                          className="japanese-display mt-2 block text-3xl font-medium leading-tight"
                          href={`/name/${name.slug}`}
                        >
                          {variation.kanji}
                        </Link>
                      ) : (
                        <p className="japanese-display mt-2 text-3xl font-medium leading-tight">
                          {variation.kanji}
                        </p>
                      )}
                      <p className="japanese-display mt-1 text-sm text-[#647068]">
                        {name.hiragana}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
                      Meaning
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#536058]">
                      {getMeaningPreview(variation)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {name.styles.map((item) => <span className="chip capitalize" key={item}>{item}</span>)}
                    <span className="chip capitalize">{name.popularityLevel.replace("_", " ")}</span>
                  </div>
                  <div className="mt-5 flex items-center gap-4 border-t border-[#e3e2dc] pt-4 text-xs font-bold text-[#315c4b]">
                    {name.isIndexable && <Link href={`/name/${name.slug}`}>View details</Link>}
                    {usesDictionaryGlosses && (
                      <span className="font-medium text-[#747d77]">
                        Source-backed
                      </span>
                    )}
                    <Link
                      href={`/?firstName=${name.id}#generator`}
                      onClick={() => trackEvent("use_name_in_generator", { firstNameId: name.id })}
                    >
                      Use this name
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <button className="button-secondary" onClick={() => setVisible((value) => value + PAGE_SIZE)} type="button">
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="surface mt-4 py-12 text-center">
          <p className="font-semibold">No names match these filters.</p>
          <button
            className="button-secondary mt-4"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
