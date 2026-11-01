import type { SurnameRecord } from "@/types/names";

export function SurnameTimeline({
  timeline,
}: {
  timeline: SurnameRecord["timeline"];
}) {
  const hasSpecific = timeline.some((item) => item.surnameSpecific);
  return (
    <div className="surface p-6">
      {!hasSpecific && (
        <p className="mb-5 text-[0.82rem] leading-relaxed text-(--muted-soft)">
          General context for Japanese surname systems — no surname-specific
          dated event has completed source review yet.
        </p>
      )}
      {timeline.length > 0 && (
        <ol className="relative ml-2 border-l border-[#b8c4bb]">
          {timeline.map((item, index) => (
            <li className="relative ml-6 pb-8 last:pb-0" key={`${item.period}-${item.title}-${index}`}>
              <span className="absolute -left-[2.05rem] top-1 size-3 rounded-full border-2 border-(--paper) bg-(--clay)" />
              <p className="eyebrow">{item.year ?? item.period}</p>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-(--muted)">{item.description}</p>
              {item.surnameSpecific && <span className="chip mt-2">Surname-specific</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
