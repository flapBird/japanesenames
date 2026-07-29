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
  const [order, setOrder] = useState<NameOrder>("japanese");

  const results = useMemo(
    () =>
      generateNames({
        filters,
        lockedSurnameId,
        lockedFirstNameId,
        seed,
      }),
    [filters, lockedFirstNameId, lockedSurnameId, seed],
  );

  function applyFilters() {
    setFilters(draftFilters);
    setSeed((value) => value + 1);
    trackEvent("generate_names", { ...draftFilters });
    trackEvent("filter_generator", { ...draftFilters });
  }

  function regenerate() {
    if (lockedSurnameId && lockedFirstNameId) return;
    setSeed((value) => value + 1);
    trackEvent("regenerate_names", {
      lockedSurnameId,
      lockedFirstNameId,
    });
  }

  function resetFilters() {
    setDraftFilters(defaultFilters);
    setFilters(defaultFilters);
    setSeed((value) => value + 1);
  }

  return (
    <section className="scroll-mt-4" id="generator" aria-labelledby="generator-title">
      <div className="surface overflow-hidden shadow-[var(--shadow)]">
        <div className="border-b border-[#d9ddd8] bg-[#eef2ee] px-5 py-4 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Structured data · no AI assembly</p>
              <h2 className="mt-1 text-xl font-semibold" id="generator-title">
                Build an authentic full name
              </h2>
            </div>
            <NameOrderToggle onChange={setOrder} value={order} />
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <GeneratorFilters onChange={setDraftFilters} value={draftFilters} />
          {(lockedSurnameId || lockedFirstNameId) && (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Locked values">
              {lockedSurnameId && (
                <button
                  className="chip !border-[#aac0b1] !bg-[#e7eee9]"
                  onClick={() => setLockedSurnameId(undefined)}
                  type="button"
                >
                  Surname: {surnameById.get(lockedSurnameId)?.romaji} · Unlock ×
                </button>
              )}
              {lockedFirstNameId && (
                <button
                  className="chip !border-[#aac0b1] !bg-[#e7eee9]"
                  onClick={() => setLockedFirstNameId(undefined)}
                  type="button"
                >
                  First name: {firstNameById.get(lockedFirstNameId)?.romaji} · Unlock ×
                </button>
              )}
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button className="button-primary" onClick={applyFilters} type="button">
              Generate 6 names
            </button>
            <button
              className="button-secondary"
              disabled={Boolean(lockedSurnameId && lockedFirstNameId)}
              onClick={regenerate}
              type="button"
            >
              Generate again
            </button>
            {lockedSurnameId && lockedFirstNameId && (
              <span className="text-xs text-[#68726b]">
                Unlock either part to generate alternatives.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6" aria-live="polite">
        {results.length > 0 ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-[#647068]">
                {results.length} structured matches · surname shown first by default
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <GeneratedNameCard
                  firstNameLocked={lockedFirstNameId === item.firstName.id}
                  item={item}
                  key={item.key}
                  onLockFirstName={() => {
                    setLockedFirstNameId((current) =>
                      current === item.firstName.id ? undefined : item.firstName.id,
                    );
                    trackEvent("lock_first_name", { id: item.firstName.id });
                  }}
                  onLockSurname={() => {
                    setLockedSurnameId((current) =>
                      current === item.surname.id ? undefined : item.surname.id,
                    );
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
