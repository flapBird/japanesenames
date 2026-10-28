import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const namesMeaningFlower: Article = {
  slug: "japanese-names-meaning-flower",
  title: "Japanese Names Meaning Flower: Sakura, Hana, and 26 Floral Names",
  metaTitle: "Japanese Names Meaning Flower: Sakura, Hana, Yuri & More",
  metaDescription:
    "Japanese flower names with kanji and meanings — Sakura (桜), Hana (花), Momoka (桃花), Kaede (楓), Yuri (百合), Ren (蓮) — plus the trees and greens that flower beside them.",
  summary:
    "Sakura, Hana, Momoka, Kaede, Yuri, Ren, Sumire — 26 Japanese names grown from flower and plant kanji, each with its written form.",
  category: "meanings",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["japanese-names-meaning-light", "japanese-names-meaning-snow", "unisex-japanese-names"],
  intro: [
    "Japan's four distinct seasons made flowers a natural naming vocabulary: plum blossoms in February, cherries in April, irises in May, maples in November. A flower name quietly dates a child to a season — and in the case of Sakura, to a national obsession.",
    "Flower kanji also combine freely with other fashionable characters, which is why modern rankings overflow with names like Himari (sun + hollyhock) and Ichika (one + flower). The entries below give the spelling that carries the flower, because the same sounds exist in flowerless spellings too.",
  ],
  blocks: [
    { type: "heading", text: "The flower itself" },
    {
      type: "nameEntries",
      entries: [
        e("Sakura", "桜", "さくら", "girl", "Cherry blossom (桜) — the national flower and the classic Japanese girl name. The modern favorite spelling 咲良 pairs 'bloom' (咲) with 'good' (良)."),
        e("Hana", "花", "はな", "girl", "Flower (花), one character, one syllable pair. Also a widely loved name across cultures, which makes it a favorite for bilingual families."),
        e("Hanae", "花恵", "はなえ", "girl", "Flower (花) + blessing (恵): a flower's grace given. 花枝, 'flower branch,' is the traditional spelling."),
        e("Hanako", "花子", "はなこ", "girl", "Flower + child (花子) — the everygirl of Japanese textbooks (like Jane Doe), and a real name with a century of history."),
        e("Ichika", "一花", "いちか", "girl", "One flower (一花): a single bloom, all the more precious for it. A fixture of recent top-10 lists."),
        e("Chika", "千花", "ちか", "girl", "A thousand flowers (千花). 千 is a lucky multiplier character — abundance by the thousand."),
        e("Renge", "蓮花", "れんげ", "girl", "Lotus blossom (蓮花), the flower of Buddhist purity. Rare as a registered name, unforgettable once heard."),
        e("Fuuka", "楓花", "ふうか", "girl", "Maple (楓) + flower (花): an autumn blossom with a soft, modern sound."),
      ],
    },
    { type: "heading", text: "Named for specific flowers" },
    {
      type: "nameEntries",
      entries: [
        e("Momo", "桃", "もも", "girl", "Peach (桃) — blossom, fruit, and the Momotaro folklore in one. Sweet in every sense."),
        e("Momoka", "桃花", "ももか", "girl", "Peach blossom (桃花) or peach + fragrance (桃香). The compound form of Momo that charted through the 2000s."),
        e("Yuri", "百合", "ゆり", "girl", "Lily (百合). Note for pop-culture readers: the word also names a genre of girls'-love manga — the flower came first."),
        e("Yuriko", "百合子", "ゆりこ", "girl", "Lily + child (百合子), the formed classic behind the modern short form."),
        e("Sumire", "菫", "すみれ", "girl", "Violet (菫) — the small spring flower of poetry. Quietly elegant, often written すみれ in kana."),
        e("Ayame", "菖蒲", "あやめ", "girl", "Iris (菖蒲), the May flower of Children's Day, whose leaves stand like swords. Also spelled 綾目 or in kana あやめ."),
        e("Ran", "蘭", "らん", "unisex", "Orchid (蘭). Short, striking, and historically the character for Holland — the window on Western learning in Edo Japan."),
        e("Botan", "牡丹", "ぼたん", "unisex", "Peony (牡丹), the 'king of flowers' in East Asian tradition. Bold and lush; rare but registerable."),
        e("Kiku", "菊", "きく", "unisex", "Chrysanthemum (菊), the imperial flower. Old-fashioned as a given name — the imperial family uses it as a clan emblem."),
        e("An", "杏", "あん", "girl", "Apricot (杏): blossom and fruit, one soft syllable. Travels exceptionally well."),
        e("Ume", "梅", "うめ", "unisex", "Plum blossom (梅) — February's flower, blooming in snow. Old-fashioned and deeply seasonal."),
        e("Aoi", "葵", "あおい", "unisex", "Hollyhock (葵), the Tokugawa crest plant. A top-10 name that doubles as the deep-blue color name when written 蒼."),
        e("Himari", "陽葵", "ひまり", "girl", "Sun (陽) + hollyhock (葵) — Japan's most popular girl name of recent years, and a flower name by way of the sun."),
        e("Nadeshiko", "撫子", "なでしこ", "girl", "Dianthus (撫子), the flower of the phrase Yamato nadeshiko, the classical ideal of Japanese grace. Almost purely literary as a name."),
        e("Suzuran", "鈴蘭", "すずらん", "girl", "Lily of the valley (鈴蘭) — literally 'bell orchid.' A woodland rarity as a name, and lovely in kana."),
      ],
    },
    { type: "heading", text: "Trees, leaves, and green things" },
    {
      type: "nameEntries",
      entries: [
        e("Kaede", "楓", "かえで", "girl", "Maple (楓) — the tree whose autumn leaves Japan travels to see. A gentle name with a seasonal signature."),
        e("Momiji", "紅葉", "もみじ", "girl", "Autumn maple foliage (紅葉), literally 'crimson leaves.' The flower-power of November."),
        e("Ren", "蓮", "れん", "unisex", "Lotus (蓮) — the flower that rises unstained from the mud. A top boy name that is, botanically, a flower name."),
        e("Azusa", "梓", "あずさ", "girl", "Catalpa (梓), the tree whose wood once made bows and printing blocks. A name with a craft heritage."),
        e("Wakaba", "若葉", "わかば", "girl", "Young leaves (若葉) — first growth in spring. A fresh-start name, common in kana."),
      ],
    },
    {
      type: "callout",
      title: "Flower names for boys",
      text: "Most flower names register as girls' names, but the plant world is shared: Ren (蓮 lotus) is a top boy name, Ran (蘭 orchid) and Kiku (菊 chrysanthemum) appear for both genders, and tree names like Itsuki (樹) and Takumi carry greenery without the blossom.",
    },
  ],
  faq: [
    {
      question: "What Japanese name means flower?",
      answer:
        "Hana (花) means flower directly, and Ichika (一花) means one flower. Sakura (桜) means cherry blossom, Momo (桃) peach blossom, Yuri (百合) lily, Sumire (菫) violet, and Ayame (菖蒲) iris.",
    },
    {
      question: "Is Sakura a common name in Japan?",
      answer:
        "Yes — the reading Sakura has been a fixture of girls' top-20 lists for two decades, now most often written 咲良 ('blooms beautifully') rather than 桜. It is one of the few names that never really leaves fashion.",
    },
    {
      question: "What does the name Himari mean?",
      answer:
        "Himari (陽葵) pairs sun (陽) with hollyhock (葵), a plant that turns toward the sun — light meeting flower. It has been the most popular girl name in several recent national surveys.",
    },
    {
      question: "Can a Japanese boy's name mean flower?",
      answer:
        "Yes, though it is less common. Ren (蓮, lotus) is a top-10 boy name, and flower-adjacent characters like Ran (蘭, orchid) or tree kanji like 樹 (Itsuki) appear in boys' names regularly.",
    },
    {
      question: "Is Hana the same as Hannah?",
      answer:
        "They sound alike and both trace to 'flower' in their own languages — hana is Japanese for flower, Hannah is Hebrew for grace. The overlap makes Hana a favorite for bicultural families, though the meanings are technically separate.",
    },
    {
      question: "What flower is used in Japanese names most often?",
      answer:
        "The characters 葵 (hollyhock, via Himari and Aoi) and 菜 (greens, via Hina and Yuna) dominate modern rankings; 桜 (cherry blossom) remains the most iconic single flower kanji.",
    },
  ],
};
