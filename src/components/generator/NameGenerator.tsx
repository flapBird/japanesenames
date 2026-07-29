"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GeneratorFilters } from "@/components/generator/GeneratorFilters";
import { GeneratedNameCard } from "@/components/generator/GeneratedNameCard";
import { NameOrderToggle } from "@/components/generator/NameOrderToggle";
import { firstNameById, surnameById } from "@/data";
import { trackEvent } from "@/lib/analytics";
import { generateNames } from "@/lib/names";
import type { GeneratorFilters as FilterState, NameOrder } from "@/types/names";

const defaultFilters: FilterState = {
  gender: "any",
  style: "any",
  mode: "realistic",
  meaning: "any",
  kanjiLength: "any",
  surnamePopularity: "any",
};

export function NameGenerator() {
  const searchParams = useSearchParams();
  const initialSurnameId = searchParams.get("surname") ?? undefined;
  const initialFirstNameId = searchParams.get("firstName") ?? undefined;
  const validSurnameId = initialSurnameId && surnameById.has(initialSurnameId) ? initialSurnameId : undefined;
  const validFirstNameId = initialFirstNameId && firstNameById.has(initialFirstNameId) ? initialFirstNameId : undefined;
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const [lockedSurnameId, setLockedSurnameId] = useState(validSurnameId);
  const [lockedFirstNameId, setLockedFirstNameId] = useState(validFirstNameId);
  const [seed, setSeed] = useState(20260729);
  const [excludedKeys, setExcludedKeys] = useState<string[]>([]);
  const [excludedSurnameIds, setExcludedSurnameIds] = useState<string[]>([]);
  const [excludedFirstNameIds, setExcludedFirstNameIds] = useState<string[]>([]);
  const [order, setOrder] = useState<NameOrder>("japanese");

  const results = useMemo(
    () =>
      generateNames({
        filters,
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
      lockedFirstNameId,
      lockedSurnameId,
      seed,
    ],
  );

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

  function applyFilters() {
    rememberCurrentResults();
    setFilters(draftFilters);
    setSeed((value) => value + 1);
    trackEvent("generate_names", { ...draftFilters });
    trackEvent("filter_generator", { ...draftFilters });
  }

  function regenerate() {
    if (lockedSurnameId && lockedFirstNameId) return;
    rememberCurrentResults();
    setSeed((value) => value + 1);
    trackEvent("regenerate_names", {
      lockedSurnameId,
      lockedFirstNameId,
    });
  }

  function resetFilters() {
    rememberCurrentResults();
    setDraftFilters(defaultFilters);
    setFilters(defaultFilters);
    setSeed((value) => value + 1);
  }

  return (
    <section className="scroll-mt-4" id="generator" aria-labelledby="generator-title">
      <div className="surface overflow-hidden shadow-[var(--shadow)]">
        <div className="border-b border-[#d9ddd8] bg-[#eef2ee] px-4 py-2.5 sm:px-5 sm:py-3">
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
          <GeneratorFilters onChange={setDraftFilters} value={draftFilters} />
          <div className="mt-4 grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <button
              aria-label="Generate 6 names"
              className="button-primary !px-3.5 !text-[0.82rem] sm:!px-4 sm:!text-sm"
              onClick={applyFilters}
              type="button"
            >
              Generate names
            </button>
            <button
              className="button-secondary !px-3.5 !text-[0.82rem] sm:!px-4 sm:!text-sm"
              disabled={Boolean(lockedSurnameId && lockedFirstNameId)}
              onClick={regenerate}
              type="button"
            >
              Generate again
            </button>
            {lockedSurnameId && lockedFirstNameId && (
              <span className="col-span-2 text-xs text-[#68726b]">
                Unlock either part to generate alternatives.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5" aria-live="polite">
        {results.length > 0 ? (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#647068]">
                  {results.length} structured matches · surname shown first by default
                </p>
                {!lockedSurnameId && !lockedFirstNameId && (
                  <p className="mt-1 text-xs text-[#7a827d]">
                    New batches avoid names already shown in this session. Keep either part to vary the other.
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
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <GeneratedNameCard
                  firstNameLocked={lockedFirstNameId === item.firstName.id}
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
            <p className="text-lg font-semibold">No structured matches yet</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647068]">
              This combination is not represented in the reviewed demo dataset.
              Try a broader meaning, style, or name mode.
            </p>
            <button className="button-secondary mt-5" onClick={resetFilters} type="button">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
