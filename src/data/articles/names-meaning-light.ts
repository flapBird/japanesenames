import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const namesMeaningLight: Article = {
  slug: "japanese-names-meaning-light",
  title: "Japanese Names Meaning Light: Hikari, Akari, and 22 Bright Names",
  metaTitle: "Japanese Names Meaning Light: Hikari, Akari, Haruto & More",
  metaDescription:
    "Japanese names that mean light, sun, and radiance — Hikari (光), Akari (灯), Akira (明), Haruto (陽翔), Himari (陽葵), and more, with kanji and readings explained.",
  summary:
    "Hikari, Akari, Akira, Himari, Haruto, Hinata — 22 Japanese names built from light, sun, and radiance kanji, spelling by spelling.",
  category: "meanings",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["most-popular-japanese-names", "japanese-names-meaning-moon", "unisex-japanese-names"],
  intro: [
    "Light is the busiest image in modern Japanese naming. Scan any recent ranking of newborn names and the same characters keep reappearing: 光 (light), 輝 (radiance), 明 (bright), and above all 陽 (sun) — the single most fashionable character in babies' names of the last decade. The fashion is easy to explain: sun-and-light names read as hopeful in any language, and they sound bright too.",
    "As always, the meaning attaches to the kanji, not the sound. Akari written 灯 is a lamp; written 明里 it is a bright village. Here are the light names, spelling by spelling.",
  ],
  blocks: [
    { type: "heading", text: "Names built on light kanji" },
    {
      type: "nameEntries",
      entries: [
        e("Hikari", "光", "ひかり", "unisex", "Light (光), plainly and beautifully. A single luminous character; the reading is shared by a whole family of light names."),
        e("Hikaru", "光", "ひかる", "unisex", "To shine (光/輝) — the verb turned name. A 1990s staple that works for any gender."),
        e("Akari", "灯", "あかり", "girl", "A lamp's flame (灯) — the small light you keep burning. Written 明里 or 明莉 it becomes bright (明) + a place or jasmine."),
        e("Akira", "明", "あきら", "unisex", "Bright, clear (明) — the philosopher's character: clarity of mind. 亮 and 昭 are the other classic spellings."),
        e("Aki", "明", "あき", "unisex", "A short form carrying 明 (bright) or 晶 (crystal). Note that 秋 'autumn' is the homophone — spelling decides the season."),
        e("Koki", "光輝", "こうき", "boy", "Light (光) + radiance (輝) — light stacked on light. One of the most generous spellings to say aloud."),
        e("Teru", "輝", "てる", "unisex", "To gleam (輝), often as a short name or an element in Terumi, Teruyuki. An old-fashioned gem."),
        e("Mitsuru", "満", "みつる", "boy", "To be full, filled (満) — an overflowing light or harvest. Classic masculine."),
        e("Kirara", "きらら", "きらら", "girl", "Mica (雲母), the glittering mineral — in kana spelling きらら it simply means sparkle. A sound-first name of the 2010s."),
        e("Kira", "キラ", "きら", "girl", "Katakana sparkle (キラ), from kirakira — the onomatopoeia of glitter. Modern, and registerable in kana."),
      ],
    },
    { type: "heading", text: "Names built on the sun: the 陽 boom" },
    {
      type: "nameEntries",
      entries: [
        e("Haruto", "陽翔", "はると", "boy", "Sun (陽) + soar (翔): sunlight taking flight. The defining boy name of the 2010s, with dozens of legal spellings."),
        e("Himari", "陽葵", "ひまり", "girl", "Sun (陽) + hollyhock (葵): a flower that turns toward the sun. The top girl name of recent years."),
        e("Hinata", "陽向", "ひなた", "unisex", "Toward the sun (陽向) — a sunny spot in the literal sense. Warm for any gender."),
        e("Hina", "陽菜", "ひな", "girl", "Sun (陽) + greens (菜): light on young plants. 雛, the doll-festival chick, is the seasonal alternate."),
        e("Asahi", "朝陽", "あさひ", "unisex", "Morning sun (朝陽) — the day's first light. Also a major newspaper's name and a common surname element."),
        e("Yo", "陽", "よう", "unisex", "Sun (陽) alone, one syllable. Recently fashionable as a compact, international-feeling name."),
        e("Yoko", "陽子", "ようこ", "girl", "Sun (陽) + child (子). The mid-century classic — Yoko Ono's name — in its sunnier spelling."),
        e("Haruki", "陽輝", "はるき", "boy", "Sun (陽) + radiance (輝). Written 春樹 it is 'spring tree' — the novelist Murakami's spelling."),
        e("Harumi", "陽海", "はるみ", "girl", "Sun (陽) + sea (海): light on water. 春美 'spring beauty' is the traditional spelling."),
        e("Akihiko", "明彦", "あきひこ", "boy", "Bright (明) + prince/sun-lad (彦). The suffix 彦 is the old masculine counterpart to -ko."),
        e("Akemi", "明美", "あけみ", "girl", "Bright (明) + beautiful (美): dawn beauty. A Showa-era standard that still reads cleanly."),
      ],
    },
    { type: "heading", text: "Stars, gems, and glow" },
    {
      type: "nameEntries",
      entries: [
        e("Hoshi", "星", "ほし", "unisex", "Star (星). Rare as a given name, common as a surname — the star you can actually register is usually one character long."),
        e("Subaru", "昴", "すばる", "boy", "The Pleiades star cluster (昴). Astronomical, and famous worldwide from the car brand and an anime hero."),
        e("Ruri", "瑠璃", "るり", "girl", "Lapis lazuli (瑠璃) — deep blue with a glassy inner glow. A jewel-name with a thousand years of Buddhist art behind it."),
        e("Mitsuki", "光月", "みつき", "unisex", "Light (光) + moon (月): the moon as a source of light. Where the light-name list meets the [moon-name list](/articles/japanese-names-meaning-moon)."),
        e("Terumi", "輝美", "てるみ", "girl", "Radiance (輝) + beauty (美): a glow you can frame. The feminine counterpart to the boy name Teruyuki."),
      ],
    },
    {
      type: "callout",
      title: "The one-name caveat",
      text: "Haruto written 陽翔 is a sun name; Haruto written 悠斗 is a sky-and-calm name. If brightness is what you want in the name, choose a spelling where the light kanji actually appears.",
    },
  ],
  faq: [
    {
      question: "What Japanese name means light?",
      answer:
        "Hikari (光) means light directly; Hikaru (光/輝) means 'to shine'; Akari (灯) means a lamp or flame; and Akira (明) means bright or clear. Modern boy names stack light and sun kanji: Koki (光輝) is 'light radiance.'",
    },
    {
      question: "Why are so many popular Japanese names built on the character 陽?",
      answer:
        "陽 (yō, sun) has topped kanji-frequency counts in newborn names for years. It reads positively, sounds bright, and combines freely: Himari (陽葵), Hina (陽菜), Hinata (陽向), Haruto (陽翔), and Yo (陽) all share it.",
    },
    {
      question: "Is Hikari a girl name or a boy name?",
      answer:
        "Hikari is registered for both genders, leaning feminine in recent decades; Hikaru skews masculine. Japanese unisex names are normal, and the kanji does not carry gender.",
    },
    {
      question: "Does Haruto mean light?",
      answer:
        "When written 陽翔 — sun plus soaring flight — yes, the sun kanji is the first character. But Haruto has dozens of legal spellings, including 悠斗 (leisurely + Big Dipper), so the meaning belongs to the spelling, not the reading.",
    },
    {
      question: "What does Akari mean in Japanese?",
      answer:
        "Akari (灯) is a lamp or light — the glow of a small flame. Written 明里 it means 'bright village,' and 明莉 pairs bright with jasmine. Same sound, three different images.",
    },
    {
      question: "What is the difference between Hikari and Hikaru?",
      answer:
        "Hikari is the noun 'light' (光); Hikaru is the verb 'to shine' (光 or 輝). Both are registerable names; Hikari reads feminine-leaning, Hikaru masculine-leaning, with plenty of exceptions.",
    },
  ],
};
