import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const namesMeaningMoon: Article = {
  slug: "japanese-names-meaning-moon",
  title: "Japanese Names Meaning Moon: Tsuki, Mizuki, and 18 Lunar Names",
  metaTitle: "Japanese Names Meaning Moon: Tsuki, Mizuki & More",
  metaDescription:
    "Japanese names that carry the moon: Tsuki, Tsukiko, Mizuki (美月), Mitsuki, Hazuki, Akatsuki, and more — with kanji, readings, and what each spelling really says.",
  summary:
    "Tsuki, Tsukiko, Mizuki, Mitsuki, Hazuki, Akatsuki — 18 Japanese names built on the moon, with the kanji that makes each one distinct.",
  category: "meanings",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["japanese-names-meaning-light", "how-japanese-names-work", "unisex-japanese-names"],
  intro: [
    "The moon is one of the oldest images in Japanese poetry — the moon-viewing parties of autumn, the rabbit in the moon, the moon princess Kaguya of the world's oldest surviving novel. In names, the character 月 (tsuki) appears everywhere from single-character statements like Tsuki to compound names that borrow the moon as a backdrop: a beautiful moon, a leaf-month moon, a dawn moon fading.",
    "One caution before the list: in Japanese, the meaning belongs to the spelling. Mizuki written 美月 is a beautiful moon; written 美津希 it is beauty, harbor, and hope — no moon in sight. Each entry below names the spelling it describes.",
  ],
  blocks: [
    { type: "heading", text: "Names with 月 (moon) in the written form" },
    {
      type: "nameEntries",
      entries: [
        e("Tsuki", "月", "つき", "unisex", "The moon itself, as a single character. Bold and rare as a registered name, and easy to love everywhere else — it reads internationally as a short, clean sound."),
        e("Tsukiko", "月子", "つきこ", "girl", "Moon (月) + child (子), a classic formed name from the mid-20th century: a quiet, old-fashioned moonlight."),
        e("Mizuki", "美月", "みずき", "unisex", "Beautiful moon (美月) — the most famous moon name. The same reading also exists as 美津希 (beauty, harbor, hope), so check the spelling before assuming moonlight."),
        e("Mitsuki", "光月", "みつき", "unisex", "Light (光) + moon (月): a moon that glows. Also written 美月 with the same reading — the light is in the spelling, not the sound."),
        e("Runa", "月奈", "るな", "girl", "One spelling among several for this reading: moon (月) + 奈, a softening character. Runa also rides the international Luna boom."),
        e("Tsukino", "月野", "つきの", "girl", "Moon field (月野): a whole meadow under moonlight. Kana spelling つきの is also common."),
        e("Yuzuki", "柚月", "ゆづき", "girl", "Citron (柚) + moon (月). The citrus is winter fruit, the moon a cool night — a seasonal pairing."),
        e("Hazuki", "葉月", "はづき", "unisex", "Leaf month (葉月) — the old name for August, when leaves thicken toward autumn. One of several old month names that live on in given names."),
        e("Satsuki", "皐月", "さつき", "girl", "The old name for May (皐月), from 皐, sacred rice seedlings watered in that month. A classic name that carries an entire farming calendar."),
        e("Uzuki", "卯月", "うづき", "girl", "The old name for April (卯月), when the month's sprouts appear. Pairs naturally with Satsuki."),
        e("Kisaragi", "如月", "きさらぎ", "unisex", "The old name for February (如月), 'wear another layer' — the coldest month wearing a poetic mask. Rare and literary."),
        e("Mutsuki", "睦月", "むつき", "unisex", "The old name for January (睦月), the month of harmony, when people draw close (睦)."),
        e("Minazuki", "水無月", "みなづき", "unisex", "The old name for June (水無月). Despite the look, 無 here is a classical genitive particle: 'the month of water,' when paddies drink it in."),
        e("Fumizuki", "文月", "ふみづき", "unisex", "The old name for July (文月), 'month of letters' — the season of Tanabata, when people write wishes."),
        e("Kanazuki", "神無月", "かんなづき", "unisex", "The old name for October (神無月), 'month without gods' — all the gods are said to be away at Izumo. Very rare, very literary."),
        e("Akatsuki", "暁", "あかつき", "unisex", "Daybreak (暁): the hour the moon sets and the sky pales. Works as a given name and exists as a rare surname too."),
      ],
    },
    { type: "heading", text: "Moon names from myth and story" },
    {
      type: "nameEntries",
      entries: [
        e("Kaguya", "かぐや", "かぐや", "girl", "The moon princess of The Tale of the Bamboo Cutter, found inside a glowing stalk of bamboo and returned to the moon at the story's end. Almost never registered — the myth is the point."),
        e("Mochizuki", "望月", "もちづき", "unisex", "Full moon (望月): the moon at its fullest, wished upon. Far more common as a surname than a given name, but the image is exactly what moon names reach for."),
        e("Tsukuyomi", "ツクヨミ", "つくよみ", "unisex", "The Shinto moon god who rules the night. A mythological name — you will meet it in games and anime far more often than on a family register."),
      ],
    },
    {
      type: "callout",
      title: "Choosing a moon name",
      text: "If the moon is the point, keep 月 visible in the kanji: 美月, 光月, 月子, or the month names 皐月 and 葉月. If only the sound matters, remember the reading can be spelled without the moon at all — Mizuki 美津希 has none.",
    },
  ],
  faq: [
    {
      question: "What Japanese name means moon?",
      answer:
        "Tsuki (月) is the direct 'moon' name. Tsukiko (月子) means moon child, Mizuki (美月) means beautiful moon, and Mitsuki (光月) means light moon. Old month names like Satsuki (皐月, May) and Hazuki (葉月, August) also contain the moon character.",
    },
    {
      question: "Is Mizuki a moon name?",
      answer:
        "When written 美月 — beauty plus moon — yes. But Mizuki can also be written 美津希 or 瑞樹, spellings with no moon in them, so the meaning depends on the kanji the name uses.",
    },
    {
      question: "Can Tsuki be a real given name in Japan?",
      answer:
        "Yes. 月 is in the official jinmeiyō kanji list approved for personal names, so Tsuki is registerable — it is simply rare, with most parents preferring compound names that soften the single character.",
    },
    {
      question: "What does the name Satsuki mean?",
      answer:
        "Satsuki (皐月) is the old calendar name for May, from 皐, the sacred rice seedlings transplanted in that month. As a name it evokes early summer — azaleas bloom in the same season, which is why the flower shares the word.",
    },
    {
      question: "Why is Kaguya associated with the moon?",
      answer:
        "In The Tale of the Bamboo Cutter, Kaguya-hime is a moon princess discovered in bamboo and taken back to the moon at the end. The story is over a thousand years old, and her name comes from kaguyaku, 'to shine.'",
    },
    {
      question: "Is the moon character masculine or feminine in names?",
      answer:
        "Neither by rule. Mizuki and Mitsuki chart as unisex, Tsukiko reads classic-feminine, and spellings like 月彦 (Tsukihiko) exist for boys. Gender in Japanese names comes from the ending and the sound, not the moon.",
    },
  ],
};
