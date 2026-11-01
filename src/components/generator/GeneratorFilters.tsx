import type { ReactNode } from "react";
import type { GeneratorFilters as Filters } from "@/types/names";

// Gender lives in the segmented control on the generator control bar; the
// disclosure keeps the secondary filters.
const fields: Array<{
  key: keyof Filters;
  label: string;
  options: Array<{ value: string; label: string }>;
}> = [
  {
    key: "style",
    label: "Style",
    options: ["Modern", "Traditional", "Timeless", "Any"].map((label) => ({
      label,
      value: label.toLowerCase(),
    })),
  },
  {
    key: "mode",
    label: "Name mode",
    options: [
      { label: "Realistic", value: "realistic" },
      { label: "Fiction-friendly", value: "fiction_friendly" },
      { label: "Any", value: "any" },
    ],
  },
  {
    key: "meaning",
    label: "Meaning",
    options: [
      "Any", "Nature", "Strength", "Beauty", "Light", "Hope", "Wisdom",
      "Love", "Peace", "Water", "Moon", "Fire",
    ].map((label) => ({ label, value: label.toLowerCase() })),
  },
];

export function GeneratorFilters({
  value,
  onChange,
  kanjiControl,
  popularKanji,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
  kanjiControl: ReactNode;
  popularKanji: ReactNode;
}) {
  const renderField = (field: (typeof fields)[number]) => (
    <label className="grid min-w-0 gap-1.5 text-xs font-bold text-[#465149]" key={field.key}>
      {field.label}
      <select className="field" value={String(value[field.key])}
        onChange={(event) => onChange({ ...value, [field.key]: event.target.value } as Filters)}>
        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
  const active = fields.filter((field) => value[field.key] !== (field.key === "mode" ? "realistic" : "any"));
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-(--moss) [&::-webkit-details-marker]:hidden">
        More filters: style, meaning &amp; kanji{active.length ? ` (${active.length} selected)` : ""}
        <svg
          aria-hidden="true"
          className="transition-transform group-open:rotate-180"
          fill="none"
          height="12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
          viewBox="0 0 24 24"
          width="12"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{fields.map(renderField)}</div>
      <p className="mt-2 text-xs leading-5 text-(--muted)">Style and name mode are editorial guidance. Meaning themes help explore characters; they do not establish a person’s naming intention.</p>
      <div className="mt-3 border-t border-[#e5ddd8] pt-3">{kanjiControl}</div>
      {popularKanji}
    </details>
  );
}
