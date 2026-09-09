import type { KanjiMeaning } from "@/types/names";

export function CharacterNotes({ parts }: { parts: KanjiMeaning[] }) {
  return (
    <details className="mt-3 text-xs leading-5 text-[#59645d]">
      <summary className="cursor-pointer font-semibold text-[#315c4b]">Character dictionary notes</summary>
      <p className="mt-2">These are general dictionary senses, including abbreviations and other contexts. They do not establish the meaning or intention of this name.</p>
      <dl className="mt-2 space-y-2">
        {parts.map((part, index) => <div key={`${part.kanji}-${index}`}>
          <dt className="japanese-display font-semibold">{part.kanji}</dt>
          <dd>{part.meanings.join("; ")}</dd>
        </div>)}
      </dl>
    </details>
  );
}
