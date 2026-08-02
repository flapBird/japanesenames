"use client";

import { useState } from "react";
import {
  givenNamePopularKanji,
  kanjiFilterCopy,
  kanjiTargetOptions,
  isSingleKanji,
  normalizeKanjiInput,
  surnamePopularKanji,
  togglePopularKanji,
} from "@/lib/kanji";
import type { KanjiTarget } from "@/types/names";

type Shortcut = { label: string; kanji: string };
type KanjiChange = (value: { kanji: string; target: KanjiTarget }) => void;

function ShortcutGroup({
  label, options, counts, kanji, onChange, target,
}: {
  label: string;
  options: readonly Shortcut[];
  counts: Record<string, number>;
  kanji: string;
  onChange: KanjiChange;
  target: KanjiTarget;
}) {
  return (
    <fieldset className="mt-3">
      <legend className="text-[0.7rem] font-bold text-[#465149]">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = kanji === option.kanji;
          const unavailable = (counts[option.kanji] ?? 0) === 0;
          return (
            <button
              aria-pressed={selected}
              className={`chip min-h-8 px-2.5 text-xs transition-colors ${selected ? "!border-[#b87481] !bg-[#f4dde2] !text-[#7f4651]" : "hover:!border-[#c4919b] hover:!bg-[#fbf1f3]"}`}
              disabled={unavailable}
              key={option.kanji}
              onClick={() => onChange({ kanji: togglePopularKanji(kanji, option.kanji), target })}
              title={unavailable ? "No matches with the current filters" : undefined}
              type="button"
            >
              {option.label} <span aria-hidden="true" className="japanese-display font-semibold">{option.kanji}</span>
              <span className="text-[0.65rem] opacity-70">· {counts[option.kanji] ?? 0}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function KanjiFilterFields({
  error, kanji, onChange, onSubmit, target,
}: {
  error?: string;
  kanji: string;
  onChange: KanjiChange;
  onSubmit: () => void;
  target: KanjiTarget;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <label className="grid w-full content-start gap-1 text-[0.7rem] font-bold text-[#465149] sm:w-56">
        {kanjiFilterCopy.includeKanji}
        <input
          aria-describedby={error ? "kanji-filter-error" : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          className="field japanese-display w-full px-2 text-center"
          onChange={(event) => onChange({ kanji: normalizeKanjiInput(event.target.value), target })}
          onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); onSubmit(); } }}
          placeholder={kanjiFilterCopy.kanjiPlaceholder}
          spellCheck={false}
          type="text"
          value={kanji}
        />
      </label>
      <label className="grid w-full content-start gap-1 text-[0.7rem] font-bold text-[#465149] sm:w-44">
        {kanjiFilterCopy.useKanjiIn}
        <select className="field" onChange={(event) => onChange({ kanji, target: event.target.value as KanjiTarget })} value={target}>
          {kanjiTargetOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {error && <span className="mb-2 max-w-48 text-xs font-medium text-[#9b493b]" id="kanji-filter-error" role="alert">{error}</span>}
    </div>
  );
}

export function KanjiPopularShortcuts({
  kanji, target, givenCounts, surnameCounts, onChange,
}: {
  kanji: string;
  target: KanjiTarget;
  givenCounts: Record<string, number>;
  surnameCounts: Record<string, number>;
  onChange: KanjiChange;
}) {
  const [open, setOpen] = useState(false);
  const showGiven = target === "given-name" || target === "either";
  const showSurname = target === "surname" || target === "either";
  return (
    <section aria-label="Popular kanji" className="t-acc mt-2" data-open={open}>
      <button
        aria-controls="popular-kanji-panel"
        aria-expanded={open}
        className="button-quiet t-acc-head !min-h-8 !px-1 text-xs"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Browse popular kanji
        <span className="t-acc-chevron" aria-hidden="true">
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16"><path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
        </span>
      </button>
      <div
        aria-hidden={!open}
        className="t-acc-panel"
        id="popular-kanji-panel"
        inert={!open}
      >
        <div className="t-acc-panel-inner">
          {showGiven && <ShortcutGroup counts={givenCounts} kanji={kanji} label="Popular Given Name" onChange={onChange} options={givenNamePopularKanji} target={target} />}
          {showSurname && <ShortcutGroup counts={surnameCounts} kanji={kanji} label="Popular Surname" onChange={onChange} options={surnamePopularKanji} target={target} />}
        </div>
      </div>
      {isSingleKanji(kanji) && <p className="mt-2 text-xs text-[#647068]">Active filter: <span className="japanese-display font-semibold">{kanji}</span></p>}
    </section>
  );
}
