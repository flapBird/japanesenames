import Link from "next/link";
import type { ArticleNameEntry } from "@/types/articles";

const genderChip: Record<NonNullable<ArticleNameEntry["gender"]>, string> = {
  girl: "bg-[#f7e8ec] text-[#8c3a52]",
  boy: "bg-[#e3ecf5] text-[#2d5b86]",
  unisex: "bg-[#efe9f4] text-[#6a4d86]",
};

export function ArticleNameCard({ entry }: { entry: ArticleNameEntry & { detailHref?: string } }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="japanese-display text-4xl font-semibold">{entry.kanji}</p>
        {entry.gender && (
          <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${genderChip[entry.gender]}`}>
            {entry.gender}
          </span>
        )}
      </div>
      <p className="mt-3 font-semibold">
        {entry.romaji}
        <span className="japanese-display ml-2 text-sm font-normal text-[#647068]">{entry.kana}</span>
      </p>
      <p className="mt-2 text-sm leading-6 text-[#59645d]">{entry.note}</p>
      {entry.detailHref && (
        <p className="mt-3 text-xs font-bold text-[#315c4b]">View name page →</p>
      )}
    </>
  );
  const className =
    "surface block h-full p-5 transition hover:border-[#aac0b1]";
  return entry.detailHref ? (
    <Link href={entry.detailHref} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
