"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import { trackEvent } from "@/lib/analytics";
import type { FirstNameRecord, Gender } from "@/types/names";

const PAGE_SIZE = 9;

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
  const [sort, setSort] = useState("alphabetical");
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
        const rank = { very_common: 0, common: 1, uncommon: 2, rare: 3 };
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
    setSort("alphabetical");
    setVisible(PAGE_SIZE);
  }

  return (
    <section aria-labelledby="browse-heading">
      <div className="surface p-3 sm:p-4">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
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
          {activeFilterCount > 0 && (
            <button
              className="button-quiet ml-auto !min-h-8 shrink-0 !px-2 text-xs"
              onClick={clearFilters}
              type="button"
            >
              Clear filters
            </button>
          )}
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
              return (
                <article className="surface flex flex-col p-5" key={name.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link className="japanese-display text-3xl font-medium" href={`/name/${name.slug}`}>
                        {variation.kanji}
                      </Link>
                      <p className="mt-1 font-semibold">{name.romaji}</p>
                      <p className="japanese-display text-sm text-[#647068]">{name.hiragana}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <PronunciationButton
                        label={name.romaji}
                        text={name.hiragana}
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
                          href: `/name/${name.slug}`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#536058]">
                    {variation.meanings.join("; ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {name.styles.map((item) => <span className="chip capitalize" key={item}>{item}</span>)}
                    <span className="chip capitalize">{name.popularityLevel.replace("_", " ")}</span>
                  </div>
                  <div className="mt-5 flex items-center gap-4 border-t border-[#e3e2dc] pt-4 text-xs font-bold text-[#315c4b]">
                    <Link href={`/name/${name.slug}`}>View details</Link>
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
