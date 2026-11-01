import Link from "next/link";
import type { ArticleBlock } from "@/types/articles";
import { ArticleNameCard } from "./ArticleNameCard";
import { articleEntriesWithHref, articleHeadingAnchor } from "@/lib/articles";

// Article copy stores links in the compact [label](/path) form so data files
// stay plain text; only internal paths are turned into links.
function renderInlineText(text: string, keyPrefix: string) {
  const parts = text.split(/(\[[^\]]+\]\(\/[^)\s]*\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/);
    if (!match) return <span key={`${keyPrefix}-${index}`}>{part}</span>;
    return (
      <Link
        className="font-semibold text-(--moss) underline underline-offset-4"
        href={match[2]}
        key={`${keyPrefix}-${index}`}
      >
        {match[1]}
      </Link>
    );
  });
}

// Headings in article data carry their number in the text ("1. The surname
// comes first"); the number is split out so it can pick up the clay accent.
function splitHeadingNumber(text: string) {
  const match = text.match(/^(\d+)\.\s+(.*)$/);
  return match ? { number: match[1], label: match[2] } : undefined;
}

function renderTableCell(cell: string, keyPrefix: string) {
  if (cell === "Feminine") {
    return <span className="font-semibold text-[#a35564]">Feminine</span>;
  }
  if (cell === "Masculine") {
    return <span className="font-semibold text-(--moss)">Masculine</span>;
  }
  return renderInlineText(cell, keyPrefix);
}

export function ArticleRenderer({ blocks }: { blocks: ArticleBlock[] }) {
  // Anchors must mirror articleToc() in lib/articles: headings are numbered
  // in block order, so the TOC links land on the matching h2.
  const headingAnchorByBlock = new Map<number, string>();
  let headingIndex = 0;
  blocks.forEach((block, index) => {
    if (block.type === "heading") {
      headingAnchorByBlock.set(index, articleHeadingAnchor(headingIndex));
      headingIndex += 1;
    }
  });

  return (
    <div className="article-body">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p className="mt-5 max-w-3xl text-[1.03rem] leading-7 text-[#3f4b44] first:mt-0" key={key}>
                {renderInlineText(block.text, key)}
              </p>
            );
          case "heading": {
            const parts = splitHeadingNumber(block.text);
            return (
              <h2
                className="article-heading mt-12 max-w-3xl scroll-mt-6 text-[1.7rem] font-bold leading-tight sm:text-[1.8rem]"
                id={headingAnchorByBlock.get(index)}
                key={key}
              >
                {parts ? (
                  <>
                    <span className="text-(--clay)">{parts.number}.</span> {parts.label}
                  </>
                ) : (
                  block.text
                )}
              </h2>
            );
          }
          case "list":
            return (
              <ul
                className="mt-5 max-w-3xl list-disc space-y-2 pl-5 text-[1.03rem] leading-7 text-[#3f4b44]"
                key={key}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}>{renderInlineText(item, `${key}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                className="mt-8 flex max-w-3xl items-start gap-4 rounded-2xl bg-(--moss-soft) p-5"
                key={key}
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-(--moss)"
                >
                  <svg
                    fill="none"
                    height="16"
                    stroke="#fffefb"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
                  </svg>
                </span>
                <div>
                  {block.title && <p className="text-[0.95rem] font-bold">{block.title}</p>}
                  <p className="mt-1.5 text-sm leading-6 text-[#334740]">
                    {renderInlineText(block.text, `${key}-text`)}
                  </p>
                </div>
              </aside>
            );
          case "nameEntries": {
            const entries = articleEntriesWithHref(block.entries);
            const grid = (
              <div
                className={
                  block.title || block.linkLabel
                    ? "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                    : "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                }
              >
                {entries.map((entry) => (
                  <ArticleNameCard entry={entry} key={`${key}-${entry.romaji}-${entry.kanji}`} />
                ))}
              </div>
            );
            if (!block.title && !block.linkLabel) {
              return <div key={key}>{grid}</div>;
            }
            return (
              <div
                className="mt-8 max-w-3xl rounded-2xl border border-(--line) bg-(--surface)/95 p-5"
                key={key}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  {block.title && <p className="eyebrow !text-(--moss)">{block.title}</p>}
                  {block.linkLabel && block.linkHref && (
                    <Link
                      className="text-xs font-bold text-(--moss) underline-offset-4 hover:underline"
                      href={block.linkHref}
                    >
                      {block.linkLabel} →
                    </Link>
                  )}
                </div>
                {grid}
                <p className="mt-3 text-xs text-(--muted-soft)">
                  Meanings describe the written form, not the sound. Links open the full record
                  with sources.
                </p>
              </div>
            );
          }
          case "figure":
            return (
              <figure className="mt-8 max-w-3xl" key={key}>
                <div className="rounded-2xl border border-(--line) bg-(--surface)/95 p-5 sm:p-6">
                  <p className="eyebrow">{block.label}</p>
                  <div className="mt-4 grid gap-4">
                    {block.bars.map((bar) => (
                      <div key={bar.label}>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold text-[#334740]">{bar.label}</p>
                          <p className="article-heading text-xl font-bold text-(--moss)">
                            {bar.value}
                          </p>
                        </div>
                        <div
                          className={`mt-1.5 h-3 overflow-hidden rounded-full ${
                            bar.tone === "moss" ? "bg-(--moss-soft)" : "bg-(--clay-soft)"
                          }`}
                        >
                          <div
                            className={`h-full rounded-full ${
                              bar.tone === "moss" ? "bg-(--moss)" : "bg-(--clay)"
                            }`}
                            style={{
                              width: `${Math.round(Math.min(Math.max(bar.ratio, 0), 1) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {block.chips && block.chips.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-xs text-(--muted-strong)">
                          {block.chipsLabel ?? "Also legal:"}
                        </span>
                        {block.chips.map((chip) => (
                          <span
                            className="rounded-full border border-(--line) bg-(--paper-raised) px-3 py-1 text-xs font-semibold"
                            key={chip}
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <figcaption className="mt-2.5 text-[0.8rem] leading-6 text-(--muted-soft)">
                  {block.caption}
                  {block.source ? ` ${block.source}` : ""}
                </figcaption>
              </figure>
            );
          case "quoteCard":
            return (
              <figure className="mt-8 max-w-3xl" key={key}>
                <div className="rounded-2xl bg-(--indigo-soft) p-6 sm:p-7">
                  <span aria-hidden="true" className="block font-serif text-6xl leading-none text-(--indigo)/40">
                    “
                  </span>
                  <blockquote className="mt-1">
                    <p className="article-heading text-[1.3rem] font-semibold leading-relaxed text-[#33454f]">
                      {renderInlineText(block.text, `${key}-quote`)}
                    </p>
                  </blockquote>
                  {(block.tag || block.note) && (
                    <figcaption className="mt-4 flex flex-wrap items-center gap-3">
                      {block.tag && (
                        <span className="rounded-full border border-(--indigo)/45 px-3 py-1 text-xs font-bold text-[#4d606b]">
                          {block.tag}
                        </span>
                      )}
                      {block.note && (
                        <span className="text-[0.8rem] leading-5 text-(--muted-strong)">{block.note}</span>
                      )}
                    </figcaption>
                  )}
                </div>
              </figure>
            );
          case "table":
            return (
              <div
                className="mt-8 max-w-3xl overflow-x-auto rounded-2xl border border-(--line) bg-(--surface)/95"
                key={key}
              >
                <table className="w-full border-collapse text-[0.92rem]">
                  <thead>
                    <tr className="bg-[#f3f4ef]">
                      {block.columns.map((column) => (
                        <th
                          className="px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.12em] text-(--muted-strong)"
                          key={column}
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[#334740]">
                    {block.rows.map((row, rowIndex) => (
                      <tr className="border-t border-(--line-soft)" key={`${key}-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td
                            className="px-4 py-3 align-top leading-6"
                            key={`${key}-${rowIndex}-${cellIndex}`}
                          >
                            {cellIndex === 0 ? (
                              <strong className="font-bold">{cell}</strong>
                            ) : (
                              renderTableCell(cell, `${key}-${rowIndex}-${cellIndex}`)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
