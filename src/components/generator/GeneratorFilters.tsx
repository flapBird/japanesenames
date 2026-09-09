import type { ReactNode } from "react";
import type { GeneratorFilters as Filters } from "@/types/names";

const fields: Array<{
  key: keyof Filters;
  label: string;
  options: Array<{ value: string; label: string }>;
}> = [
  {
    key: "gender",
    label: "Gender",
    options: ["Girl", "Boy", "Unisex", "Any"].map((label) => ({
      label,
      value: label.toLowerCase(),
    })),
  },
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
  action,
  kanjiControl,
  popularKanji,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
  action: ReactNode;
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
  const active = fields.slice(1).filter((field) => value[field.key] !== (field.key === "mode" ? "realistic" : "any"));
  return (
    <div>
      <div className="grid items-end gap-3 sm:grid-cols-[minmax(10rem,16rem)_auto]">
        {renderField(fields[0])}
        <div>{action}</div>
      </div>
      <details className="mt-4 border-t border-[#e5ddd8] pt-3">
        <summary className="cursor-pointer text-sm font-semibold text-[#315c4b]">
          More filters: style, meaning &amp; kanji{active.length ? ` (${active.length} selected)` : ""}
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">{fields.slice(1).map(renderField)}</div>
        <p className="mt-2 text-xs leading-5 text-[#647068]">Style and name mode are editorial guidance. Meaning themes help explore characters; they do not establish a person’s naming intention.</p>
        <div className="mt-3 border-t border-[#e5ddd8] pt-3">{kanjiControl}</div>
        {popularKanji}
      </details>
    </div>
  );
}
