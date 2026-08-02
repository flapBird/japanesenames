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
  return (
    <div>
      <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        {fields.map((field) => (
          <label className="grid min-w-0 content-start gap-1.5 text-[0.7rem] font-bold text-[#465149]" key={field.key}>
            {field.label}
            <select
              className="field"
              onChange={(event) => {
                const raw = event.target.value;
                onChange({
                  ...value,
                  [field.key]: raw,
                } as Filters);
              }}
              value={String(value[field.key])}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">{action}</div>
      </div>
      <div className="mt-3 border-t border-[#e5ddd8] pt-3">{kanjiControl}</div>
      {popularKanji}
    </div>
  );
}
