import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const namesMeaningSnow: Article = {
  slug: "japanese-names-meaning-snow",
  title: "Japanese Names Meaning Snow: Yuki, Miyuki, and 14 Winter Names",
  metaTitle: "Japanese Names Meaning Snow: Yuki, Miyuki, Yukina & More",
  metaDescription:
    "Japanese names that mean snow and winter — Yuki (雪), Yukiko (雪子), Miyuki (美雪), Yukina (雪菜), Fuyuki (冬樹) — with kanji, readings, and the seasonal imagery behind each.",
  summary:
    "Yuki, Yukiko, Miyuki, Yukina, Fuyuki, Mafuyu — 14 Japanese names built on snow and winter kanji, spelling by spelling.",
  category: "meanings",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["japanese-names-meaning-flower", "japanese-names-meaning-light", "unisex-japanese-names"],
  intro: [
    "In a country where whole cities shut down for snowfall, naming a child snow is not a small gesture. The character 雪 (yuki) brings a specific set of images — clean, quiet, transient beauty — and it has anchored Japanese girls' names for a century, from the classic Yukiko to the modern favorite Yuki.",
    "Two cautions shape this list. First, Yuki is famously polysemous: the same reading is also 幸 (happiness), 由紀 (reason + chronicle), and more, so only the 雪 spelling means snow. Second, winter names go beyond 雪: the season character 冬 (fuyu) and a few poetic compounds carry the same chill.",
  ],
  blocks: [
    { type: "heading", text: "Names built on 雪 (snow)" },
    {
      type: "nameEntries",
      entries: [
        e("Yuki", "雪", "ゆき", "unisex", "Snow (雪), one character. The most famous — and most ambiguous — Japanese winter name: written 幸 it means happiness, 由紉 or 由紀 mean chronicle and reason. Snow is in the spelling."),
        e("Yukiko", "雪子", "ゆきこ", "girl", "Snow + child (雪子), the mid-century classic — a snowflake among the -ko names."),
        e("Yukina", "雪菜", "ゆきな", "girl", "Snow (雪) + greens (菜): snow on young plants, the same pairing that made Hina (陽菜) popular. 雪奈 is the kana-flavored alternate."),
        e("Miyuki", "美雪", "みゆき", "girl", "Beautiful snow (美雪) — deep, fresh powder. A Showa-era standard that still reads crisply today."),
        e("Sayuki", "紗雪", "さゆき", "girl", "Gauze (紗) + snow (雪): snow fine as woven silk. A delicate, less common spelling."),
        e("Yukie", "雪恵", "ゆきえ", "girl", "Snow (雪) + blessing (恵). The -e ending marks it as a slightly older generation's classic."),
        e("Setsuka", "雪香", "せつか", "girl", "Snow (雪) + fragrance (香): scented snow — a contradiction the kanji resolves. Note that 節か 'season-festival' spellings share the sound."),
        e("Yukito", "雪人", "ゆきと", "boy", "Snow (雪) + person (人): one who belongs to snow. A gentle boy spelling of the Yuki family."),
        e("Yukiya", "雪也", "ゆきや", "boy", "Snow (雪) + 也, a classical 'also/being' character. The masculine rendering of the same winter image."),
        e("Kazahana", "風花", "かざはな", "unisex", "Snow flurries on a windy day (風花) — literally 'wind flower.' A poetic weather word turned rare, beautiful name."),
      ],
    },
    { type: "heading", text: "Names built on winter: 冬" },
    {
      type: "nameEntries",
      entries: [
        e("Fuyuki", "冬樹", "ふゆき", "unisex", "Winter (冬) + tree (樹): a tree standing through winter. Written 冬希 it becomes 'winter hope.'"),
        e("Fuyumi", "冬美", "ふゆみ", "girl", "Winter (冬) + beauty (美): the beauty of the cold season."),
        e("Fuyuka", "冬香", "ふゆか", "girl", "Winter (冬) + fragrance (香): the crisp smell of cold air."),
        e("Mafuyu", "真冬", "まふゆ", "unisex", "True winter (真冬), the coldest stretch of the season — midwinter, named honestly. Rare, modern, and striking."),
      ],
    },
    {
      type: "callout",
      title: "The Yuki trap, stated plainly",
      text: "Yuki is one of Japan's most common given-name sounds and one of its most polysemous: 雪 snow, 幸 happiness, 由紀 reason and chronicle, and several more. If snow is the meaning you want, choose a spelling that shows 雪 — Yukiko, Yukina, Miyuki — and check that spelling is what gets registered.",
    },
  ],
  faq: [
    {
      question: "What Japanese name means snow?",
      answer:
        "Yuki (雪) means snow directly, and it anchors a family of names: Yukiko (雪子, snow child), Yukina (雪菜, snow greens), Miyuki (美雪, beautiful snow), and Setsuka (雪香, scented snow). The meaning belongs to the 雪 spelling — Yuki written 幸 means happiness instead.",
    },
    {
      question: "Is Yuki a unisex name?",
      answer:
        "Yes. Yuki is registered for both boys and girls; the spelling tends to differ, with 雪 (snow) more common for girls and 悠輝 or 勇気-style spellings appearing for boys.",
    },
    {
      question: "What does Miyuki mean?",
      answer:
        "Written 美雪, Miyuki means beautiful snow. Other spellings exist — 深雪 is 'deep snow,' 美幸 is 'beautiful happiness' — so the kanji decides whether the name is wintry or joyful.",
    },
    {
      question: "What Japanese names mean winter?",
      answer:
        "Fuyuki (冬樹, winter tree), Fuyumi (冬美, winter beauty), Fuyuka (冬香, winter fragrance), and Mafuyu (真冬, true midwinter) are built on the winter character 冬 (fuyu).",
    },
    {
      question: "Is snow a positive image in Japanese names?",
      answer:
        "Yes. Snow carries purity, quiet, and clean beauty in Japanese aesthetics rather than coldness or hardship — which is why it has been a girls'-name staple for generations.",
    },
    {
      question: "What is the name meaning 'first snow'?",
      answer:
        "Hatsuyuki (初雪) is the season word for the first snowfall of the year. It is recognized by every Japanese speaker and appears mostly in fiction rather than on family registers.",
    },
  ],
};
