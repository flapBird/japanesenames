"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GeneratorFilters } from "@/components/generator/GeneratorFilters";
import { GeneratedNameCard } from "@/components/generator/GeneratedNameCard";
import { KanjiFilterFields, KanjiPopularShortcuts } from "@/components/generator/KanjiFilterControls";
import { NameOrderToggle } from "@/components/generator/NameOrderToggle";
import { firstNameById, surnameById } from "@/data";
import { trackEvent } from "@/lib/analytics";
import {
  givenNamePopularKanji,
  isSingleKanji,
  kanjiFilterCopy,
  normalizeKanjiInput,
  surnamePopularKanji,
} from "@/lib/kanji";
import { generateNameBatch, getKanjiShortcutCount } from "@/lib/names";
import type {
  GeneratorFilters as FilterState,
  KanjiFilter,
  KanjiTarget,
  NameOrder,
} from "@/types/names";

const defaultFilters: FilterState = {
  gender: "any",
  style: "any",
  mode: "realistic",
  meaning: "any",
  kanjiLength: "any",
  surnamePopularity: "any",
};

function kanjiResultTitle(kanji: string, target: KanjiTarget) {
  if (target === "given-name") return "Japanese given names with";
  if (target === "surname") return "Japanese surnames with";
  return "Names containing";
}

function createRandomSeed() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] || 1;
}

export function NameGenerator() {
  const searchParams = useSearchParams();
  const initialSurnameId = searchParams.get("surname") ?? undefined;
  const initialFirstNameId = searchParams.get("firstName") ?? undefined;
  const validSurnameId = initialSurnameId && surnameById.has(initialSurnameId) ? initialSurnameId : undefined;
  const validFirstNameId = initialFirstNameId && firstNameById.has(initialFirstNameId) ? initialFirstNameId : undefined;
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const [draftKanji, setDraftKanji] = useState("");
  const [draftKanjiTarget, setDraftKanjiTarget] =
    useState<KanjiTarget>("given-name");
  const [kanjiFilter, setKanjiFilter] = useState<KanjiFilter>({
    target: "given-name",
  });
  const [kanjiError, setKanjiError] = useState<string>();
  const [lockedSurnameId, setLockedSurnameId] = useState(validSurnameId);
  const [lockedFirstNameId, setLockedFirstNameId] = useState(validFirstNameId);
  const [seed, setSeed] = useState(20260729);
  const [excludedKeys, setExcludedKeys] = useState<string[]>([]);
  const [excludedSurnameIds, setExcludedSurnameIds] = useState<string[]>([]);
  const [excludedFirstNameIds, setExcludedFirstNameIds] = useState<string[]>([]);
  const [shownFirstNameCounts, setShownFirstNameCounts] = useState<Record<string, number>>({});
  const [shownVariationCounts, setShownVariationCounts] = useState<Record<string, number>>({});
  const [shownSurnameCounts, setShownSurnameCounts] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<NameOrder>("japanese");
  const normalizedDraftKanji = normalizeKanjiInput(draftKanji);
  const hasPendingFilters =
    JSON.stringify(draftFilters) !== JSON.stringify(filters) ||
    normalizedDraftKanji !== (kanjiFilter.kanji ?? "") ||
    (Boolean(normalizedDraftKanji) &&
      draftKanjiTarget !== (kanjiFilter.target ?? "given-name"));
  const hasActiveSettings =
    JSON.stringify(draftFilters) !== JSON.stringify(defaultFilters) ||
    JSON.stringify(filters) !== JSON.stringify(defaultFilters) ||
    Boolean(normalizedDraftKanji) ||
    Boolean(kanjiFilter.kanji) ||
    draftKanjiTarget !== "given-name" ||
    Boolean(lockedSurnameId || lockedFirstNameId);

  const batch = useMemo(
    () =>
      generateNameBatch({
        filters,
        kanjiFilter,
        lockedSurnameId,
        lockedFirstNameId,
        excludeKeys: excludedKeys,
        excludeSurnameIds: excludedSurnameIds,
        excludeFirstNameIds: excludedFirstNameIds,
        shownFirstNameCounts,
        shownVariationCounts,
        shownSurnameCounts,
        seed,
      }),
    [
      excludedFirstNameIds,
      excludedKeys,
      excludedSurnameIds,
      filters,
      kanjiFilter,
      lockedFirstNameId,
      lockedSurnameId,
      seed,
      shownFirstNameCounts,
      shownSurnameCounts,
      shownVariationCounts,
    ],
  );
  const results = batch.results;
  const givenCounts = useMemo(() => Object.fromEntries(givenNamePopularKanji.map((item) => [item.kanji, getKanjiShortcutCount(item.kanji, "given-name", draftFilters)])), [draftFilters]);
  const surnameCounts = useMemo(() => Object.fromEntries(surnamePopularKanji.map((item) => [item.kanji, getKanjiShortcutCount(item.kanji, "surname", draftFilters)])), [draftFilters]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSeed(createRandomSeed()));
    return () => cancelAnimationFrame(frame);
  }, []);

  function advanceSeed() {
    setSeed(createRandomSeed());
  }

  function rememberCurrentResults() {
    if (results.length === 0) return;
    setExcludedKeys((current) => [
      ...new Set([...current, ...results.map((item) => item.key)]),
    ]);
    setExcludedSurnameIds((current) => [
      ...new Set([...current, ...results.map((item) => item.surname.id)]),
    ]);
    setExcludedFirstNameIds((current) => [
      ...new Set([...current, ...results.map((item) => item.firstName.id)]),
    ]);
    const increment = (current: Record<string, number>, values: string[]) => {
      const next = { ...current };
      for (const value of values) next[value] = (next[value] ?? 0) + 1;
      return next;
    };
    setShownFirstNameCounts((current) => increment(current, results.map((item) => item.firstName.id)));
    setShownVariationCounts((current) => increment(current, results.map((item) => item.variation.kanji)));
    setShownSurnameCounts((current) => increment(current, results.map((item) => item.surname.id)));
  }

  function startNewCycle() {
    setExcludedKeys([]);
    setExcludedSurnameIds([]);
    setExcludedFirstNameIds([]);
    advanceSeed();
  }

  function generate() {
    if (lockedSurnameId && lockedFirstNameId) return;
    if (normalizedDraftKanji && !isSingleKanji(normalizedDraftKanji)) {
      setKanjiError(kanjiFilterCopy.invalidKanji);
      return;
    }

    setKanjiError(undefined);
    rememberCurrentResults();
    setFilters(draftFilters);
    setKanjiFilter({
      kanji: normalizedDraftKanji || undefined,
      target: draftKanjiTarget,
    });
    advanceSeed();
    if (hasPendingFilters) {
      const properties = {
        ...draftFilters,
        kanji: normalizedDraftKanji || undefined,
        kanjiTarget: draftKanjiTarget,
      };
      trackEvent("generate_names", properties);
      trackEvent("filter_generator", properties);
    } else {
      trackEvent("regenerate_names", {
        lockedSurnameId,
        lockedFirstNameId,
      });
    }
  }

  function resetFilters() {
    rememberCurrentResults();
    setDraftFilters(defaultFilters);
    setFilters(defaultFilters);
    setDraftKanji("");
    setDraftKanjiTarget("given-name");
    setKanjiFilter({ target: "given-name" });
    setKanjiError(undefined);
    setLockedSurnameId(undefined);
    setLockedFirstNameId(undefined);
    advanceSeed();
  }

  function clearKanjiFilter() {
    rememberCurrentResults();
    setDraftKanji("");
    setDraftKanjiTarget("given-name");
    setKanjiFilter({ target: "given-name" });
    setKanjiError(undefined);
    advanceSeed();
  }

  return (
    <section className="scroll-mt-4" id="generator" aria-labelledby="generator-title">
      <div className="surface overflow-hidden border-[#e4d6d8] shadow-[var(--shadow)]">
        <div className="border-b border-[#ead6da] bg-[#f7ecee] px-4 py-2.5 sm:px-5 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="sr-only" id="generator-title">
              Build an authentic full name
            </h2>
            <span aria-hidden="true" className="hidden text-lg font-semibold sm:block">
              Build an authentic full name
            </span>
            <NameOrderToggle onChange={setOrder} value={order} />
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <GeneratorFilters
            action={
              <div className="flex w-full items-center gap-2 lg:w-auto">
                <button
                  aria-label={
                    hasPendingFilters
                      ? "Apply filters and generate 6 names"
                      : "Generate 6 new names"
                  }
                  className="button-primary flex-1 !min-h-[2.55rem] !px-4 !text-sm lg:w-28 lg:flex-none"
                  disabled={Boolean(lockedSurnameId && lockedFirstNameId)}
                  onClick={generate}
                  type="button"
                >
                  Generate
                </button>
                <button
                  className="button-secondary flex-1 !min-h-[2.55rem] !px-3 !text-sm lg:flex-none"
                  disabled={!hasActiveSettings}
                  onClick={resetFilters}
                  type="button"
                >
                  Reset
                </button>
              </div>
            }
            kanjiControl={
              <KanjiFilterFields
                error={kanjiError}
                kanji={draftKanji}
                onChange={(value) => {
                  setDraftKanji(value.kanji);
                  setDraftKanjiTarget(value.target);
                  setKanjiError(value.kanji && !isSingleKanji(value.kanji) ? kanjiFilterCopy.invalidKanji : undefined);
                }}
                onSubmit={generate}
                target={draftKanjiTarget}
              />
            }
            onChange={setDraftFilters}
            popularKanji={
              <KanjiPopularShortcuts
                givenCounts={givenCounts}
                kanji={draftKanji}
                onChange={(value) => {
                  setDraftKanji(value.kanji);
                  setDraftKanjiTarget(value.target);
                  setKanjiError(value.kanji && !isSingleKanji(value.kanji) ? kanjiFilterCopy.invalidKanji : undefined);
                }}
                surnameCounts={surnameCounts}
                target={draftKanjiTarget}
              />
            }
            value={draftFilters}
          />
          {lockedSurnameId && lockedFirstNameId && (
            <p className="mt-2 text-xs text-[#68726b]">
              Unlock either part to generate alternatives.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5" aria-live="polite">
        {results.length > 0 ? (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                {kanjiFilter.kanji && (
                  <h2 className="mb-1 text-lg font-semibold">
                    {kanjiResultTitle(
                      kanjiFilter.kanji,
                      kanjiFilter.target ?? "given-name",
                    )}{" "}
                    <span className="japanese-display rounded bg-[#f1dfe3] px-1.5">
                      {kanjiFilter.kanji}
                    </span>
                  </h2>
                )}
              </div>
              {(lockedSurnameId || lockedFirstNameId) && (
                <div className="flex flex-wrap gap-2" aria-label="Kept name parts">
                  {lockedSurnameId && (
                    <button
                      className="chip !border-[#aac0b1] !bg-[#e7eee9]"
                      onClick={() => {
                        rememberCurrentResults();
                        setLockedSurnameId(undefined);
                        advanceSeed();
                      }}
                      type="button"
                    >
                      Keeping surname: {surnameById.get(lockedSurnameId)?.romaji} · Remove ×
                    </button>
                  )}
                  {lockedFirstNameId && (
                    <button
                      className="chip !border-[#aac0b1] !bg-[#e7eee9]"
                      onClick={() => {
                        rememberCurrentResults();
                        setLockedFirstNameId(undefined);
                        advanceSeed();
                      }}
                      type="button"
                    >
                      Keeping first name: {firstNameById.get(lockedFirstNameId)?.romaji} · Remove ×
                    </button>
                  )}
                </div>
              )}
            </div>
            {results.length < 6 && <div className="mb-4 rounded-xl border border-[#decf9f] bg-[#f7f1df] px-4 py-3 text-sm leading-6 text-[#685526]">Only {results.length} unseen exact matches remain. Filters and kanji constraints were not relaxed.</div>}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <GeneratedNameCard
                  firstNameLocked={lockedFirstNameId === item.firstName.id}
                  highlightKanji={kanjiFilter.kanji}
                  item={item}
                  key={item.key}
                  onLockFirstName={() => {
                    rememberCurrentResults();
                    setLockedFirstNameId(item.firstName.id);
                    advanceSeed();
                    trackEvent("lock_first_name", { id: item.firstName.id });
                  }}
                  onLockSurname={() => {
                    rememberCurrentResults();
                    setLockedSurnameId(item.surname.id);
                    advanceSeed();
                    trackEvent("lock_surname", { id: item.surname.id });
                  }}
                  order={order}
                  surnameLocked={lockedSurnameId === item.surname.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="surface py-12 text-center">
            {batch.poolCount > 0 ? (
              <>
                <p className="text-lg font-semibold">This exact pool has completed its cycle.</p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647068]">Start a new cycle to allow previously shown full names again. Your filters remain unchanged.</p>
                <button className="button-secondary mt-5" onClick={startNewCycle} type="button">Start new cycle</button>
              </>
            ) : kanjiFilter.kanji ? (
              <>
                <p className="text-lg font-semibold">
                  {kanjiFilterCopy.noMatchingNames}
                </p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647068]">
                  We couldn&apos;t find a name containing this kanji with the
                  selected filters. Try another kanji or change where it appears.
                </p>
                <button
                  className="button-secondary mt-5"
                  onClick={clearKanjiFilter}
                  type="button"
                >
                  {kanjiFilterCopy.clearKanjiFilter}
                </button>
                <button className="button-secondary ml-2 mt-5" onClick={resetFilters} type="button">Clear other filters</button>
                {(kanjiFilter.target ?? "given-name") !== "either" && <button className="button-secondary ml-2 mt-5" onClick={() => { setDraftKanjiTarget("either"); setKanjiFilter({ kanji: kanjiFilter.kanji, target: "either" }); advanceSeed(); }} type="button">Change to Either</button>}
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Structured data unavailable</p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647068]">
                  No reviewed records are available for the locked name parts.
                  Remove a lock or clear the filters to continue.
                </p>
                <button className="button-secondary mt-5" onClick={resetFilters} type="button">
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
