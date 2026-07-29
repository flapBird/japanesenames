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
  {
    key: "kanjiLength",
    label: "First-name length",
    options: [
      { value: "any", label: "Any" },
      { value: "1", label: "1 Kanji" },
      { value: "2", label: "2 Kanji" },
      { value: "3", label: "3 Kanji" },
    ],
  },
  {
    key: "surnamePopularity",
    label: "Surname popularity",
    options: ["Common", "Uncommon", "Rare", "Any"].map((label) => ({
      label,
      value: label.toLowerCase(),
    })),
  },
];

export function GeneratorFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3 xl:grid-cols-6">
      {fields.map((field) => (
        <label className="grid content-start gap-1.5 text-[0.7rem] font-bold text-[#465149]" key={field.key}>
          {field.label}
          <select
            className="field"
            onChange={(event) => {
              const raw = event.target.value;
              onChange({
                ...value,
                [field.key]:
                  field.key === "kanjiLength" && raw !== "any"
                    ? Number(raw)
                    : raw,
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
    </div>
  );
}
