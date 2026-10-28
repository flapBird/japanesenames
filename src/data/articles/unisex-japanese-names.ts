import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const unisexJapaneseNames: Article = {
  slug: "unisex-japanese-names",
  title: "Unisex Japanese Names: 24 Names That Work for Any Gender",
  metaTitle: "Unisex Japanese Names: Ren, Aoi, Hikaru & 21 More",
  metaDescription:
    "Japanese names that are genuinely unisex — Ren, Aoi, Hikaru, Akira, Yuki, Hinata, Sora, Minato — with kanji, readings, and which way each name leans by gender.",
  summary:
    "Ren, Aoi, Hikaru, Akira, Yuki, Hinata, Sora — 24 Japanese names that register for both boys and girls, with each name's gender lean explained.",
  category: "lists",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["how-japanese-names-work", "most-popular-japanese-names", "japanese-names-that-work-in-english"],
  intro: [
    "Japanese has a genuine unisex naming tradition — not a recent workaround, but a living one. The family register records gender-agnostic readings like Ren, Aoi, Hikaru, and Yuki for newborns of any sex, and several of them sit near the top of the boys' and girls' rankings at the same time. Aoi, in fact, is a top-10 name for both genders simultaneously.",
    "Unisex does not mean evenly split. Every name below registers for both genders, but each leans one way in recent use — and the lean can flip by generation (Hikaru was more feminine in the 1980s; today it skews masculine). The notes describe the current tilt, spelling by spelling.",
  ],
  blocks: [
    { type: "heading", text: "The classic unisex names" },
    {
      type: "nameEntries",
      entries: [
        e("Ren", "蓮", "れん", "unisex", "Lotus (蓮) for boys, 恋 (romantic love) for girls — same sound, two registers. A top-10 boy name that also charts for girls."),
        e("Aoi", "葵", "あおい", "unisex", "Hollyhock (葵) or deep blue (蒼). One of the rare names that is simultaneously top-10 for boys and girls — spelled the same way."),
        e("Hikaru", "光", "ひかる", "unisex", "To shine (光/輝). Masculine in recent decades, feminine in the 1980s — a name whose gender tilt is generational."),
        e("Akira", "明", "あきら", "unisex", "Bright, clear (明). Historically masculine, registered for girls too — the kanji carries no gender at all."),
        e("Yuki", "雪", "ゆき", "unisex", "Snow (雪) or happiness (幸). Skews feminine for the snow spelling, masculine in spellings like 悠輝."),
        e("Kaoru", "薫", "かおる", "unisex", "Fragrance (薫) — the scent of tea, timber, or blossoms. A literary unisex name from the Heian era onward."),
        e("Ryo", "涼", "りょう", "unisex", "Cool, refreshing (涼), also 亮 (clear). Leans masculine but registers for girls; short and modern."),
        e("Makoto", "誠", "まこと", "unisex", "Sincerity, truth (誠/真). A virtue name that registers for both genders, masculine-leaning in practice."),
        e("Haru", "晴", "はる", "unisex", "Clear weather (晴), spring (春), or leisurely (悠). One syllable of pure flexibility, leaning slightly boy."),
        e("Nao", "尚", "なお", "unisex", "Esteemed, upright (尚), or 直 (straight). Compact and even-keeled between genders."),
      ],
    },
    { type: "heading", text: "Nature unisex names" },
    {
      type: "nameEntries",
      entries: [
        e("Hinata", "陽向", "ひなた", "unisex", "Toward the sun (陽向) — a sunny spot. A genuine both-gender chart name; leans boy for the reading today, girl in anime familiarity."),
        e("Sora", "空", "そら", "unisex", "Sky (空). Rising for boys and girls alike; spelled 昊 or 穹 in the rarer forms."),
        e("Minato", "湊", "みなと", "unisex", "Harbor (湊): where boats find shelter. A top boy name that registers for girls too."),
        e("Asahi", "朝陽", "あさひ", "unisex", "Morning sun (朝陽). Leans boy; the image is sunny for anyone."),
        e("Mizuki", "美月", "みずき", "unisex", "Beautiful moon (美月) — historically a girl name, now charting for boys in spellings like 瑞樹."),
        e("Itsuki", "樹", "いつき", "unisex", "Tree (樹). Leans boy; the sound is soft enough that girls' registers appear regularly."),
        e("Nagisa", "渚", "なぎさ", "unisex", "Water's edge (渚) — the strip of shore between land and sea. Feminine-leaning overall, but a famous boy anime bearer."),
        e("Kai", "海", "かい", "unisex", "Ocean (海). Leans boy in Japan; internationally it reads boy everywhere — one of the easiest crossover names."),
        e("Rin", "凛", "りん", "unisex", "Dignified composure (凛). A top girl name that also registers for boys, especially in single-kanji form."),
        e("Shion", "詩音", "しおん", "unisex", "Poem (詩) + sound (音), or the aster flower (紫苑). Feminine-leaning, with regular boys' registrations."),
      ],
    },
    { type: "heading", text: "Virtue and motion unisex names" },
    {
      type: "nameEntries",
      entries: [
        e("Tsubasa", "翼", "つばさ", "unisex", "Wing (翼) — flight as a name. Leans boy; girls' registrations are common enough that it stays unisex."),
        e("Kanata", "彼方", "かなた", "unisex", "The far distance (彼方) — 'over there, beyond.' Modern, poetic, and genuinely even between genders."),
        e("Yu", "悠", "ゆう", "unisex", "Leisurely, far-reaching (悠), or 優 (gentle). One mora that anchors dozens of compound names — and stands alone as unisex."),
        e("Aki", "明", "あき", "unisex", "Bright (明) or autumn (秋) — the season decides with the spelling. Evenly shared between genders."),
      ],
    },
    {
      type: "callout",
      title: "How 'unisex' works in Japan",
      text: "The family register records gender but the law does not restrict names by it — a boy named Aoi is fully legal and increasingly ordinary. What keeps a name 'unisex' is usage: readings like Aoi and Ren appear steadily in both boys' and girls' annual rankings, often with identical kanji.",
    },
  ],
  faq: [
    {
      question: "What Japanese names are unisex?",
      answer:
        "Ren, Aoi, Hikaru, Akira, Yuki, Hinata, Sora, Minato, Haru, Kaoru, and Makoto all register for both boys and girls in Japan. Aoi and Ren chart near the top of both boys' and girls' rankings at the same time.",
    },
    {
      question: "Is Aoi a boy or girl name?",
      answer:
        "Both. Aoi (葵, hollyhock / 蒼, deep blue) is a top-10 name for boys and girls simultaneously — one of the few truly even unisex names in Japan.",
    },
    {
      question: "Is Yuki a boy or girl name?",
      answer:
        "Yuki is unisex. The snow spelling 雪 skews feminine, while boys more often use spellings like 悠輝 or 勇樹 — the sound is shared, the written forms differ.",
    },
    {
      question: "Are unisex names common in Japan?",
      answer:
        "Yes, and growing. Short, soft-sounding names have risen across all recent newborn rankings, and several — Aoi, Ren, Hinata, Minato — appear in the top 20 for both genders in the same year.",
    },
    {
      question: "How can you tell if a Japanese name is male or female?",
      answer:
        "You often cannot from the sound alone — and that is the point. Endings give hints (-ko and -ka lean feminine, -rō and -ta lean masculine), but unisex names rely on the kanji spelling and the family register to carry gender.",
    },
    {
      question: "Is Hikaru a boy or girl name?",
      answer:
        "Hikaru (光/輝, to shine) registers for both genders. It leaned feminine in the 1980s and skews masculine in recent decades — a good example of unisex names' generational drift.",
    },
  ],
};
