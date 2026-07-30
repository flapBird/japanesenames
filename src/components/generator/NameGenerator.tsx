"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GeneratorFilters } from "@/components/generator/GeneratorFilters";
import { GeneratedNameCard } from "@/components/generator/GeneratedNameCard";
import { KanjiFilterControls } from "@/components/generator/KanjiFilterControls";
import { NameOrderToggle } from "@/components/generator/NameOrderToggle";
import { firstNameById, surnameById } from "@/data";
import { trackEvent } from "@/lib/analytics";
import {
  isSingleKanji,
  kanjiFilterCopy,
  normalizeKanjiInput,
} from "@/lib/kanji";
import { generateNameBatch } from "@/lib/names";
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

const filterLabels: Record<keyof FilterState, string> = {
  gender: "gender",
  style: "style",
  mode: "name mode",
  meaning: "meaning",
  kanjiLength: "written length",
  surnamePopularity: "surname commonness",
};

function kanjiResultTitle(kanji: string, target: KanjiTarget) {
  if (target === "given-name") return "Japanese given names with";
  if (target === "surname") return "Japanese surnames with";
  return "Names containing";
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
  const [order, setOrder] = useState<NameOrder>("japanese");
  const normalizedDraftKanji = normalizeKanjiInput(draftKanji);
  const hasPendingFilters =
    JSON.stringify(draftFilters) !== JSON.stringify(filters) ||
    normalizedDraftKanji !== (kanjiFilter.kanji ?? "") ||
    (Boolean(normalizedDraftKanji) &&
      draftKanjiTarget !== (kanjiFilter.target ?? "given-name"));

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
    ],
  );
  const results = batch.results;

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
    setSeed((value) => value + 1);
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
    setSeed((value) => value + 1);
  }

  function clearKanjiFilter() {
    rememberCurrentResults();
    setDraftKanji("");
    setDraftKanjiTarget("given-name");
    setKanjiFilter({ target: "given-name" });
    setKanjiError(undefined);
    setSeed((value) => value + 1);
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
              <button
                aria-label={
                  hasPendingFilters
                    ? "Apply filters and generate 6 names"
                    : "Generate 6 new names"
                }
                className="button-primary w-full !min-h-[2.55rem] !px-4 !text-[0.82rem] lg:w-auto sm:!text-sm"
                disabled={Boolean(lockedSurnameId && lockedFirstNameId)}
                onClick={generate}
                type="button"
              >
                Generate
              </button>
            }
            onChange={setDraftFilters}
            value={draftFilters}
          />
          <KanjiFilterControls
            error={kanjiError}
            kanji={draftKanji}
            onChange={(value) => {
              setDraftKanji(value.kanji);
              setDraftKanjiTarget(value.target);
              setKanjiError(
                value.kanji && !isSingleKanji(value.kanji)
                  ? kanjiFilterCopy.invalidKanji
                  : undefined,
              );
            }}
            onSubmit={generate}
            target={draftKanjiTarget}
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
                <p className="text-sm text-[#647068]">
                  {results.length} structured matches · surname shown first by default
                </p>
                {!lockedSurnameId && !lockedFirstNameId && (
                  <p className="mt-1 text-xs text-[#7a827d]">
                    New batches avoid names already shown in this session. Keep either part to vary the other.
                  </p>
                )}
                {batch.reusedCount > 0 && (
                  <p className="mt-1 text-xs font-semibold text-[#8d493c]">
                    The unique reviewed pool was exhausted, so a new cycle has started.
                  </p>
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
                        setSeed((value) => value + 1);
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
                        setSeed((value) => value + 1);
                      }}
                      type="button"
                    >
                      Keeping first name: {firstNameById.get(lockedFirstNameId)?.romaji} · Remove ×
                    </button>
                  )}
                </div>
              )}
            </div>
            {batch.exactCount < results.length && (
              <div className="mb-4 rounded-xl border border-[#decf9f] bg-[#f7f1df] px-4 py-3 text-sm leading-6 text-[#685526]">
                <strong>
                  {batch.exactCount > 0
                    ? `${batch.exactCount} exact matches.`
                    : "No exact matches in the reviewed dataset."}
                </strong>{" "}
                Showing the closest unique structured names
                {batch.relaxedFilters.length > 0
                  ? ` by relaxing ${batch.relaxedFilters
                      .map((filter) => filterLabels[filter])
                      .join(", ")}.`
                  : "."}
              </div>
            )}
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
                    setSeed((value) => value + 1);
                    trackEvent("lock_first_name", { id: item.firstName.id });
                  }}
                  onLockSurname={() => {
                    rememberCurrentResults();
                    setLockedSurnameId(item.surname.id);
                    setSeed((value) => value + 1);
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
            {kanjiFilter.kanji ? (
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
