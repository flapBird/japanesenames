"use client";

import { useEffect, useState } from "react";
import type { ArticleTocEntry } from "@/lib/articles";

// Scrollspy for the desktop TOC rail: highlights the section currently in
// view. Falls back to the first entry before any observation fires.
export function ArticleTocNav({ entries }: { entries: ArticleTocEntry[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(entries[0]?.id);

  useEffect(() => {
    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (observed) => {
        const visibleIds = new Set(
          observed.filter((item) => item.isIntersecting).map((item) => item.target.id),
        );
        if (visibleIds.size === 0) return;
        const current = [...targets].reverse().find((target) => visibleIds.has(target.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav className="mt-3.5 grid" aria-label="Table of contents">
      {entries.map((entry) => {
        const active = entry.id === activeId;
        return (
          <a
            className={`-ml-2.5 flex items-start gap-2.5 rounded-lg px-2.5 py-1.5 ${
              active ? "bg-(--moss-soft)" : ""
            }`}
            href={`#${entry.id}`}
            key={entry.id}
          >
            <span
              className={`pt-[3px] text-[0.66rem] font-extrabold ${
                active ? "text-(--moss)" : "text-(--clay)"
              }`}
            >
              {entry.number}
            </span>
            <span
              className={`text-[0.82rem] leading-snug ${
                active ? "font-semibold text-(--moss-dark)" : "text-[#43504a]"
              }`}
            >
              {entry.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
