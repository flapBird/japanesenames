import type { FirstNameRecord } from "@/types/names";

const popularityLabels: Record<string, string> = {
  very_common: "very common within this collection's sources",
  common: "common within this collection's sources",
  uncommon: "uncommon within this collection's sources",
  rare: "rare within this collection's sources",
  unranked: "unranked for popularity in this collection's sources",
};

function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// A data-grounded intro paragraph for first-name detail pages. Every claim
// comes from the record itself: spellings, component glosses, gender labels.
// Glosses describe written forms, never a fixed name meaning.
export function buildFirstNameIntro(name: FirstNameRecord): string {
  const spellings = name.variations.map((variation) => variation.kanji);
  const preferred = name.variations[0];
  const parts: string[] = [];
  parts.push(
    name.variations.length > 1
      ? `${name.romaji} is a Japanese given name read ${name.hiragana} in this collection, recorded with ${name.variations.length} written forms: ${joinList(spellings)}.`
      : `${name.romaji} is a Japanese given name read ${name.hiragana} in this collection, recorded in the written form ${spellings[0]}.`,
  );
  if (preferred.meaningEvidence === "dictionary_glosses") {
    parts.push(
      `The characters of ${preferred.kanji} carry the component glosses listed below. They describe the written form rather than a fixed name meaning, because the same reading can be written many different ways.`,
    );
  } else {
    parts.push(
      `In this spelling the name is associated with ${joinList(preferred.meanings).toLowerCase()}; the component characters carry the glosses listed below.`,
    );
  }
  const genderPhrase =
    name.genders.length > 1
      ? `${name.genders.join(" and ")} use`
      : `${name.genders[0]} use`;
  parts.push(
    `This collection labels it for ${genderPhrase} and notes it as ${popularityLabels[name.popularityLevel] ?? popularityLabels.unranked}.`,
  );
  return parts.join(" ");
}

export interface NameFaq {
  question: string;
  answer: string;
}

export function buildFirstNameFaqs(name: FirstNameRecord): NameFaq[] {
  const preferred = name.variations[0];
  const faqs: NameFaq[] = [
    {
      question: `How is ${name.romaji} written in kanji?`,
      answer:
        name.variations.length > 1
          ? `${name.romaji} is recorded here as ${name.variations.map((v) => v.kanji).join(" and ")}, all read ${name.hiragana}. Each spelling carries its own character meanings, shown on this page.`
          : `${name.romaji} is recorded here as ${preferred.kanji}, read ${name.hiragana}. Other spellings of the same sound exist beyond this collection.`,
    },
    {
      question: `Is ${name.romaji} a boy name or a girl name?`,
      answer:
        name.genders.length > 1
          ? `In this collection, ${name.romaji} is recorded for ${name.genders.join(" and ")} use — a genuinely unisex reading. Gender in Japanese names comes from usage patterns and endings, not from the kanji itself.`
          : `In this collection, ${name.romaji} is recorded as a ${name.genders[0]} name. Japanese unisex names are common, so the same reading may appear in the other gender's registers with different spellings.`,
    },
    {
      question: `What does ${name.romaji} mean?`,
      answer:
        preferred.meaningEvidence === "dictionary_glosses"
          ? `The sound ${name.romaji} does not have one fixed meaning. Written ${preferred.kanji}, its characters carry the glosses ${preferred.kanjiBreakdown.map((part) => `${part.kanji} (${part.meanings.slice(0, 2).join(", ")})`).join("; ")}. These describe the written form, not a guaranteed name meaning.`
          : `Written ${preferred.kanji}, ${name.romaji} is associated with ${preferred.meanings.join(", ").toLowerCase()}. The meaning belongs to this spelling — the same reading written with other kanji carries different imagery.`,
    },
  ];
  return faqs;
}
