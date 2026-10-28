import Link from "next/link";
import type { Article } from "@/types/articles";
import { articleCategoryLabels } from "@/types/articles";
import { estimateReadingMinutes } from "@/lib/articles";

const categoryChip: Record<string, string> = {
  meanings: "bg-[#e9f1ea] text-[#315c4b]",
  popular: "bg-[#fdeee6] text-[#8c5a2f]",
  culture: "bg-[#e8ecf3] text-[#3a5478]",
  lists: "bg-[#f2eaf4] text-[#6a4d86]",
};

export function ArticleCard({ article }: { article: Article }) {
  const nameCount = article.blocks.reduce(
    (total, block) => (block.type === "nameEntries" ? total + block.entries.length : total),
    0,
  );
  return (
    <Link
      className="surface flex h-full flex-col p-6 transition hover:border-[#aac0b1]"
      href={`/articles/${article.slug}`}
    >
      <span className={`self-start rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${categoryChip[article.category]}`}>
        {articleCategoryLabels[article.category]}
      </span>
      <h3 className="mt-4 text-lg font-semibold leading-snug">{article.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[#59645d]">{article.summary}</p>
      <p className="mt-4 text-xs font-bold text-[#647068]">
        {nameCount > 0 ? `${nameCount} names · ` : ""}
        {estimateReadingMinutes(article)} min read
      </p>
    </Link>
  );
}
