import type { ReactNode } from "react";
import type { GeneratorFilters as Filters } from "@/types/names";

const meaningOptions = [
  "Nature",
  "Strength",
  "Beauty",
  "Light",
  "Hope",
  "Wisdom",
  "Love",
  "Peace",
  "Water",
  "Moon",
  "Fire",
];

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
      { value: "realistic", label: "Realistic" },
      { value: "fiction_friendly", label: "Fiction-friendly" },
      { value: "any", label: "Any" },
    ],
  },
  {
    key: "meaning",
    label: "Meaning",
    options: [
      { value: "any", label: "Any" },
      ...meaningOptions.map((label) => ({
        value: label.toLowerCase(),
        label,
      })),
    ],
  },
];

export function GeneratorFilters({
  value,
  onChange,
  action,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
  action: ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
      {fields.map((field) => (
        <label className="grid content-start gap-1.5 text-[0.7rem] font-bold text-[#465149]" key={field.key}>
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
      <div className="col-span-2 flex items-end lg:col-span-1">
        {action}
      </div>
    </div>
  );
}
