"use client";

import { useState } from "react";
import type { KanjiMeaning } from "@/types/names";

export function KanjiBreakdown({
  kanji,
  literalMeaning,
  breakdown,
}: {
  kanji: string;
  literalMeaning: string;
  breakdown: KanjiMeaning[];
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <button
      aria-expanded={expanded}
      className="kanji-breakdown surface w-full p-6 text-left sm:p-8"
      data-expanded={expanded}
      onClick={() => setExpanded((value) => !value)}
      type="button"
    >
      <span className="sr-only">Toggle kanji meanings</span>
      <span className="flex justify-center text-5xl font-medium sm:text-6xl">
        {[...kanji].map((character, index) => (
          <span className="kanji-piece japanese-display inline-block" key={`${character}-${index}`}>
            {character}
          </span>
        ))}
      </span>
      <span className="kanji-explanation mt-7 grid gap-3 sm:grid-cols-2">
        {breakdown.map((item) => (
          <span className="rounded-xl bg-[#f1f2ed] p-4 text-center" key={item.kanji}>
            <strong className="japanese-display mr-2 text-xl">{item.kanji}</strong>
            <span className="text-sm text-[#536058]">— {item.meanings.join(", ")}</span>
          </span>
        ))}
      </span>
      <span className="kanji-explanation mt-4 block text-center text-sm text-[#647068]">
        Combined literal reading: <strong className="text-[#26352d]">{literalMeaning}</strong>
      </span>
    </button>
  );
}
