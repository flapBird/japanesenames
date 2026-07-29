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
        <p className="mb-6 rounded-xl bg-[#f1f2ed] p-4 text-sm leading-6 text-[#59645d]">
          No surname-specific dated event has completed source review. The
          timeline below provides historical context for Japanese surname systems.
        </p>
      )}
      <ol className="relative ml-2 border-l border-[#b8c4bb]">
        {timeline.map((item, index) => (
          <li className="relative ml-6 pb-8 last:pb-0" key={`${item.period}-${item.title}-${index}`}>
            <span className="absolute -left-[2.05rem] top-1 size-3 rounded-full border-2 border-[#f7f5ef] bg-[#a34837]" />
            <p className="eyebrow">{item.year ?? item.period}</p>
            <h3 className="mt-1 font-semibold">{item.title}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#647068]">{item.description}</p>
            {item.surnameSpecific && <span className="chip mt-2">Surname-specific</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
