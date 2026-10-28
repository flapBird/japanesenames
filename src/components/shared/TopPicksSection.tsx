import { ArticleNameCard } from "@/components/articles/ArticleNameCard";
import { articleEntriesWithHref } from "@/lib/articles";
import type { ArticleNameEntry } from "@/types/articles";

export function TopPicksSection({
  title,
  intro,
  entries,
}: {
  title: string;
  intro: string;
  entries: ArticleNameEntry[];
}) {
  return (
    <section className="py-10">
      <p className="eyebrow">Start here</p>
      <h2 className="section-title mb-2 mt-2">{title}</h2>
      <p className="max-w-3xl text-sm leading-6 text-[#647068]">{intro}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articleEntriesWithHref(entries).map((entry) => (
          <ArticleNameCard entry={entry} key={`${entry.romaji}-${entry.kanji}`} />
        ))}
      </div>
    </section>
  );
}
