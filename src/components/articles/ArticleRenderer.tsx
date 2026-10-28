import Link from "next/link";
import type { ArticleBlock } from "@/types/articles";
import { ArticleNameCard } from "./ArticleNameCard";
import { articleEntriesWithHref } from "@/lib/articles";

// Article copy stores links in the compact [label](/path) form so data files
// stay plain text; only internal paths are turned into links.
function renderInlineText(text: string, keyPrefix: string) {
  const parts = text.split(/(\[[^\]]+\]\(\/[^)\s]*\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/);
    if (!match) return <span key={`${keyPrefix}-${index}`}>{part}</span>;
    return (
      <Link
        className="font-semibold text-[#315c4b] underline underline-offset-4"
        href={match[2]}
        key={`${keyPrefix}-${index}`}
      >
        {match[1]}
      </Link>
    );
  });
}

export function ArticleRenderer({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p className="mt-5 max-w-3xl leading-7 text-[#59645d] first:mt-0" key={key}>
                {renderInlineText(block.text, key)}
              </p>
            );
          case "heading":
            return (
              <h2 className="mt-12 max-w-3xl text-2xl font-semibold" key={key}>
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul className="mt-5 max-w-3xl list-disc space-y-2 pl-5 leading-7 text-[#59645d]" key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{renderInlineText(item, `${key}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside className="mt-8 max-w-3xl rounded-xl border border-[#d8e2d8] bg-[#f4f7f3] p-5" key={key}>
                {block.title && <p className="font-bold text-[#315c4b]">{block.title}</p>}
                <p className="mt-2 text-sm leading-6 text-[#59645d]">
                  {renderInlineText(block.text, `${key}-text`)}
                </p>
              </aside>
            );
          case "nameEntries":
            return (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" key={key}>
                {articleEntriesWithHref(block.entries).map((entry) => (
                  <ArticleNameCard entry={entry} key={`${key}-${entry.romaji}-${entry.kanji}`} />
                ))}
              </div>
            );
        }
      })}
    </div>
  );
}
