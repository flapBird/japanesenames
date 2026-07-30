import {
  kanjiFilterCopy,
  kanjiTargetOptions,
  isSingleKanji,
  normalizeKanjiInput,
  popularKanji,
  togglePopularKanji,
} from "@/lib/kanji";
import type { KanjiTarget } from "@/types/names";

export function KanjiFilterControls({
  error,
  kanji,
  onChange,
  onSubmit,
  target,
}: {
  error?: string;
  kanji: string;
  onChange: (value: { kanji: string; target: KanjiTarget }) => void;
  onSubmit: () => void;
  target: KanjiTarget;
}) {
  return (
    <section
      aria-labelledby="kanji-filter-title"
      className="mt-5 border-t border-[#e5ddd8] pt-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold" id="kanji-filter-title">
            {kanjiFilterCopy.includeKanji}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#647068]">
            {kanjiFilterCopy.includeKanjiDescription}
          </p>
        </div>
        {isSingleKanji(kanji) && (
          <span className="chip !border-[#d5bdc2] !bg-[#f7e8eb] text-[#7f4651]">
            Active: <span className="japanese-display text-sm">{kanji}</span>
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="grid content-start gap-1.5 text-[0.7rem] font-bold text-[#465149]">
          {kanjiFilterCopy.includeKanji}
          <input
            aria-describedby={error ? "kanji-filter-error" : undefined}
            aria-invalid={Boolean(error)}
            autoComplete="off"
            className="field japanese-display"
            onChange={(event) =>
              onChange({
                kanji: normalizeKanjiInput(event.target.value),
                target,
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSubmit();
              }
            }}
            placeholder={kanjiFilterCopy.kanjiPlaceholder}
            spellCheck={false}
            type="text"
            value={kanji}
          />
          {error && (
            <span
              className="text-xs font-medium text-[#9b493b]"
              id="kanji-filter-error"
              role="alert"
            >
              {error}
            </span>
          )}
        </label>

        <label className="grid content-start gap-1.5 text-[0.7rem] font-bold text-[#465149]">
          {kanjiFilterCopy.useKanjiIn}
          <select
            className="field"
            onChange={(event) =>
              onChange({
                kanji,
                target: event.target.value as KanjiTarget,
              })
            }
            value={target}
          >
            {kanjiTargetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="text-[0.7rem] font-bold text-[#465149]">
          {kanjiFilterCopy.popularMeanings}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {popularKanji.map((option) => {
            const selected = kanji === option.kanji;
            return (
              <button
                aria-pressed={selected}
                className={`chip min-h-9 px-3 transition-colors ${
                  selected
                    ? "!border-[#b87481] !bg-[#f4dde2] !text-[#7f4651]"
                    : "hover:!border-[#c4919b] hover:!bg-[#fbf1f3]"
                }`}
                key={option.kanji}
                onClick={() =>
                  onChange({
                    kanji: togglePopularKanji(kanji, option.kanji),
                    target,
                  })
                }
                type="button"
              >
                {option.label}
                <span
                  aria-hidden="true"
                  className="japanese-display text-sm font-semibold"
                >
                  {option.kanji}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}
