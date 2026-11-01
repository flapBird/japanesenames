import Link from "next/link";
import type { ArticleNameEntry } from "@/types/articles";

const genderChip: Record<NonNullable<ArticleNameEntry["gender"]>, string> = {
  girl: "bg-(--sakura-soft) text-[#8c3a52]",
  boy: "bg-[#e3ecf5] text-[#2d5b86]",
  unisex: "bg-[#efe9f4] text-[#6a4d86]",
};

export function ArticleNameCard({ entry }: { entry: ArticleNameEntry & { detailHref?: string } }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="japanese-display text-[1.6rem] font-bold leading-none">{entry.kanji}</p>
        {entry.gender && (
          <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${genderChip[entry.gender]}`}>
            {entry.gender}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-sm font-bold">
        {entry.romaji}
        <span className="japanese-display ml-1.5 text-xs font-normal text-(--muted)">{entry.kana}</span>
      </p>
      <p className="mt-1.5 text-[0.8rem] leading-5 text-(--muted-strong)">{entry.note}</p>
      {entry.detailHref && (
        <p className="mt-2.5 text-[0.72rem] font-bold text-(--moss)">View name page →</p>
      )}
    </>
  );
  const className =
    "block h-full rounded-xl border border-(--line-soft) bg-(--paper-raised) p-4 transition hover:border-(--sage)";
  return entry.detailHref ? (
    <Link href={entry.detailHref} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
