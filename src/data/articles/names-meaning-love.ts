import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const namesMeaningLove: Article = {
  slug: "japanese-names-meaning-love",
  title: "Japanese Names Meaning Love: Ai, Aiko, Ren, and 14 Names with Heart",
  metaTitle: "Japanese Names Meaning Love: Ai, Aiko, Ren & More",
  metaDescription:
    "Japanese names that mean love — Ai (愛), Aiko (愛子), Airi (愛莉), Manami (愛美), Ren (恋) — with kanji, readings, and the affection-adjacent names beside them.",
  summary:
    "Ai, Aiko, Airi, Manami, Ren, Kokoro — 14 Japanese names written with the love kanji 愛 (and the heart beside it).",
  category: "meanings",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["japanese-names-meaning-flower", "japanese-names-that-work-in-english", "unisex-japanese-names"],
  intro: [
    "The character 愛 (ai, love) is one of the most searched kanji in the world — single-character tattoos, restaurant signs, and, in Japan, actual given names. Names built on it pair love with a second character that shapes its tone: love plus child (Aiko), love plus jasmine (Airi), love plus beauty (Manami).",
    "There is also a second love kanji: 恋 (koi/ren), the romantic, longing kind — the character in love songs. It is bolder in a name, and its most famous bearer reading is the boy name Ren. The list covers both, plus the heart-adjacent names that sit just beside love.",
  ],
  blocks: [
    { type: "heading", text: "Names built on 愛 (love)" },
    {
      type: "nameEntries",
      entries: [
        e("Ai", "愛", "あい", "girl", "Love (愛), a single character and a single syllable pair. Also happens to sound like the English 'I' — a lucky coincidence for international families."),
        e("Aiko", "愛子", "あいこ", "girl", "Love + child (愛子): the formed classic. Familiar worldwide from Princess Aiko, daughter of the Emperor."),
        e("Airi", "愛莉", "あいり", "girl", "Love (愛) + jasmine (莉): love with a flower inside it. 愛梨, 'love pear,' is the fruit-flavored alternate."),
        e("Aina", "愛菜", "あいな", "girl", "Love (愛) + greens (菜): love that grows. The pairing mirrors Himari's sun-plus-plant logic."),
        e("Mana", "愛奈", "まな", "girl", "Love (愛) + 奈, the softening character. A compact modern name; 愛菜 shares the sound."),
        e("Manami", "愛美", "まなみ", "girl", "Love (愛) + beauty (美): love and beauty in four strokes each. A 1980s–90s staple still going strong."),
        e("Manaka", "愛夏", "まなか", "girl", "Love (愛) + summer (夏): midsummer love. 愛香, 'love fragrance,' is the other common spelling."),
        e("Aine", "愛音", "あいね", "girl", "Love (愛) + sound (音): love you can hear. The same kanji pair also reads Amane."),
        e("Amane", "愛音", "あまね", "unisex", "The broader reading of 愛音 — though written 周 it means 'all around, encompassing.' One sound, two very different names."),
        e("Aika", "愛花", "あいか", "girl", "Love (愛) + flower (花): a flower of love. 愛佳, 'love + excellent,' is the charting alternate spelling."),
      ],
    },
    { type: "heading", text: "Names built on 恋 (romantic love)" },
    {
      type: "nameEntries",
      entries: [
        e("Ren", "恋", "れん", "unisex", "Romantic love, longing (恋) — the emotional half of the language's two love characters. As a boy name it is more often 蓮 (lotus); the 恋 spelling is the bolder choice, and it charts for girls."),
        e("Renka", "恋花", "れんか", "girl", "Love (恋) + flower (花): a flower in love, or love in bloom. Modern, syllabic, and unmistakable."),
        e("Koi", "恋", "こい", "girl", "The other reading of 恋. Rare as a registered name — it stays mostly in poetry and romance titles — but registerable and understood."),
      ],
    },
    { type: "heading", text: "Heart-adjacent names" },
    {
      type: "nameEntries",
      entries: [
        e("Kokoro", "心", "こころ", "unisex", "Heart, mind, spirit (心) — the place love lives. A modern single-character name with a philosophical tilt."),
        e("Karen", "花恋", "かれん", "girl", "Flower (花) + love (恋): a flower's love. Written 可憐 it means 'lovely, endearing' — either way the affection is in the kanji."),
        e("Megumi", "恵", "めぐみ", "unisex", "Blessing, grace (恵) — the kindness that flows between people. The love-family's neighbor in meaning and usage."),
        e("Sachi", "幸", "さち", "girl", "Happiness, good fortune (幸). Not love exactly — the joy love is supposed to produce."),
      ],
    },
    {
      type: "callout",
      title: "Two love characters, one caution",
      text: "愛 (ai) is love as care and affection; 恋 (koi) is love as longing and romance. Japanese keeps the meanings distinct — 愛子 is a child of love, 恋花 a flower of infatuation — and so do the names built on them.",
    },
  ],
  faq: [
    {
      question: "What Japanese name means love?",
      answer:
        "Ai (愛) means love directly, and Aiko (愛子) means beloved child. Names like Airi (愛莉, love + jasmine) and Manami (愛美, love + beauty) build on the same kanji. For romantic longing, Ren (恋) carries the second love character.",
    },
    {
      question: "What is the difference between 愛 and 恋?",
      answer:
        "愛 (ai) is broad love — care, affection, attachment; 恋 (koi) is specifically romantic, longing love. Both appear in names, but 愛 names vastly outnumber 恋 names, which retain a dramatic, poetic edge.",
    },
    {
      question: "Is Ren a love name?",
      answer:
        "When written 恋 — the kanji for romantic love — yes, and the reading Ren charted for girls in recent years. Most boys named Ren are written 蓮 (lotus) instead, which makes the meaning depend entirely on the spelling.",
    },
    {
      question: "Can 愛 be a name by itself?",
      answer:
        "Yes. Ai is a registered, understood Japanese girl name — short, classical, and newly international-feeling. The character 愛 is in the approved jinmeiyō kanji list, so it is fully legal.",
    },
    {
      question: "What name means 'beloved child'?",
      answer:
        "Aiko (愛子) literally combines love and child. Manaka (愛夏) and Aina (愛菜) keep the love kanji with warmer, more modern second characters.",
    },
    {
      question: "Is Kokoro a real name?",
      answer:
        "Yes — Kokoro (心, heart) is a modern unisex given name, registerable in kanji or kana. It is also the title of Natsume Soseki's famous novel, which gives it literary weight.",
    },
  ],
};
