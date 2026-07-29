"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { trackEvent } from "@/lib/analytics";
import type { SurnameRecord } from "@/types/names";

const PAGE_SIZE = 9;

export function SurnameExplorer({ surnames }: { surnames: SurnameRecord[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");
  const [popularity, setPopularity] = useState("any");
  const [origin, setOrigin] = useState("any");
  const [region, setRegion] = useState("any");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [randomId, setRandomId] = useState<string>();

  const origins = [...new Set(surnames.flatMap((surname) => surname.originTypes))].sort();
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
      .sort((a, b) => a.romaji.localeCompare(b.romaji));
  }, [letter, origin, popularity, query, region, surnames]);

  const displayed = randomId
    ? filtered.filter((surname) => surname.id === randomId)
    : filtered.slice(0, visible);

  return (
    <section aria-labelledby="surname-results">
      <div className="surface p-5 sm:p-6">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 text-xs font-bold lg:col-span-2">
            Search Japanese last names
            <input
              className="field"
              onChange={(event) => {
                setQuery(event.target.value);
                setRandomId(undefined);
                trackEvent("search_surnames", { query: event.target.value });
              }}
              placeholder="Search Kanji, Romaji, or Hiragana"
              type="search"
              value={query}
            />
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Commonness
            <select className="field" onChange={(event) => setPopularity(event.target.value)} value={popularity}>
              <option value="any">Any commonness</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Origin type
            <select className="field capitalize" onChange={(event) => setOrigin(event.target.value)} value={origin}>
              <option value="any">Any origin</option>
              {origins.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Regional evidence
            <select className="field" onChange={(event) => setRegion(event.target.value)} value={region}>
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
          {["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((item) => (
            <button
              aria-pressed={letter === item}
              className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                letter === item ? "bg-[#315c4b] text-white" : "bg-[#efefe9] text-[#59645d]"
              }`}
              key={item}
              onClick={() => {
                setLetter(item);
                setRandomId(undefined);
              }}
              type="button"
            >
              {item === "All" ? "•" : item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <h2 className="section-title !text-2xl" id="surname-results">Japanese family names</h2>
        <span className="text-sm text-[#647068]">{filtered.length} matches</span>
      </div>
      {displayed.length ? (
        <>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayed.map((surname) => (
              <article className="surface flex flex-col p-5" key={surname.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <Link className="japanese-display text-3xl font-medium" href={`/surname/${surname.slug}`}>
                      {surname.kanji}
                    </Link>
                    <p className="mt-1 font-semibold">{surname.romaji}</p>
                    <p className="japanese-display text-sm text-[#647068]">{surname.hiragana}</p>
                  </div>
                  <FavoriteButton
                    compact
                    item={{
                      id: `surname:${surname.id}`,
                      kind: "surname",
                      label: `${surname.kanji} · ${surname.romaji}`,
                      sublabel: surname.literalMeaning,
                      href: `/surname/${surname.slug}`,
                    }}
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-[#536058]">{surname.literalMeaning}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="chip capitalize">{surname.popularityLevel.replace("_", " ")}</span>
                  {surname.originTypes.slice(0, 2).map((item) => <span className="chip capitalize" key={item}>{item}</span>)}
                </div>
                <div className="mt-5 flex gap-4 border-t border-[#e3e2dc] pt-4 text-xs font-bold text-[#315c4b]">
                  <Link href={`/surname/${surname.slug}`} onClick={() => trackEvent("open_surname", { id: surname.id })}>
                    View surname
                  </Link>
                  <Link href={`/?surname=${surname.id}#generator`}>Use in generator</Link>
                </div>
              </article>
            ))}
          </div>
          {!randomId && visible < filtered.length && (
            <div className="mt-8 text-center">
              <button className="button-secondary" onClick={() => setVisible((value) => value + PAGE_SIZE)} type="button">
                Load more
              </button>
            </div>
          )}
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
