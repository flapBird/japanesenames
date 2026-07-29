import type { OriginConfidence } from "@/types/names";

const labels: Record<OriginConfidence, string> = {
  well_documented: "Well documented",
  common_interpretation: "Common interpretation",
  multiple_possible_origins: "Multiple possible origins",
  literal_interpretation_only: "Literal interpretation only",
  uncertain: "Uncertain",
};

const explanations: Record<OriginConfidence, string> = {
  well_documented:
    "The central claim is supported by attached historical or institutional sources.",
  common_interpretation:
    "This explanation is widely used and consistent with the spelling, but it may not describe every lineage.",
  multiple_possible_origins:
    "More than one plausible historical pathway exists; the spelling alone cannot choose between them.",
  literal_interpretation_only:
    "The character meaning is clear, but a surname-specific historical origin has not been established here.",
  uncertain:
    "Available information is not strong enough for a more specific origin statement.",
};

export function OriginConfidenceBadge({
  confidence,
}: {
  confidence: OriginConfidence;
}) {
  return (
    <div className="rounded-xl border border-[#d9c4bd] bg-[#f4e9e5] p-5">
      <p className="eyebrow">Origin confidence</p>
      <p className="mt-2 text-lg font-semibold">{labels[confidence]}</p>
      <p className="mt-2 text-sm leading-6 text-[#665d59]">{explanations[confidence]}</p>
    </div>
  );
}
