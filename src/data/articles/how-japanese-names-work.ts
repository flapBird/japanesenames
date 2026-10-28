import type { Article } from "@/types/articles";

export const howJapaneseNamesWork: Article = {
  slug: "how-japanese-names-work",
  title: "How Japanese Names Work: Order, Kanji Rules, and Naming Customs",
  metaTitle: "How Japanese Names Work: Kanji Rules, Order & Customs",
  metaDescription:
    "A plain-English guide to Japanese naming customs: surname-first order, legal kanji lists, unregulated readings, and why married couples share a surname.",
  summary:
    "Surname order, the legal kanji list, unregulated readings, and the one-surname-per-marriage rule — everything that shapes how Japanese names are built.",
  category: "culture",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["most-popular-japanese-names", "most-common-japanese-surnames", "unisex-japanese-names"],
  intro: [
    "Japanese names look simple in a textbook — a surname, a given name, a few kanji. In practice they are shaped by a family register law, an official kanji list, reading customs that are mostly free-form, and habits that go back to village life before the Meiji era.",
    "This guide walks through the rules and the customs in plain English, so you can read any Japanese name — or choose one — with a clear picture of what is actually allowed and what is merely tradition.",
  ],
  blocks: [
    { type: "heading", text: "1. The surname comes first" },
    {
      type: "paragraph",
      text: "In Japanese, the family name (姓, sei) precedes the given name (名, mei). Tanaka Yuki is Ms. Tanaka, named Yuki — the reverse of the English order. Japanese documents, news media, and everyday speech all follow this order, and official Latin-alphabet passports have followed suit since 2020, when the government began recommending TANAKA YUKI over Yuki TANAKA in the machine-readable convention.",
    },
    {
      type: "paragraph",
      text: "In Western contexts — business cards aimed at overseas partners, international bylines — many Japanese people simply reverse the order and accept the ambiguity. When you see a single name like \"Sakura Suzuki,\" the safe reading is: Suzuki is the surname, Sakura the given name.",
    },
    { type: "heading", text: "2. The given name is where the meaning lives" },
    {
      type: "paragraph",
      text: "A Japanese given name is not a word with one fixed meaning. The sound — Haruto, Yui, Ren — is paired with a written form, and the written form carries the meaning. Haruto can be written 陽翔 (sun + soar), 悠斗 (leisurely + Big Dipper), or with dozens of other character pairs; each spelling is a different name with a different image.",
    },
    {
      type: "paragraph",
      text: "This is why Japanese name discussions always start from the kanji. Two cousins both called Rin are not necessarily named after the same thing at all: one might be 凛 (dignified composure), another 琳 (a beautiful jewel). Any meaning list that attaches one gloss to a sound alone is flattening this system.",
    },
    {
      type: "callout",
      title: "Practical upshot",
      text: "If you are choosing a Japanese name, choose the kanji and the reading together. Our [name generator](/) always shows the written form next to the sound for exactly this reason.",
    },
    { type: "heading", text: "3. Which kanji are legal?" },
    {
      type: "paragraph",
      text: "You cannot write a Japanese name in any character you like. The Family Register Act limits name kanji to two official lists: the jōyō kanji — the 2,136 characters taught through high school — and the jinmeiyō kanji, an extra set of roughly 860 characters approved for personal names (things like 峻, 凛, and 葵). Hiragana, katakana, and long-vowel marks are also allowed, which is why purely kana names like さくら or メイ exist.",
    },
    {
      type: "paragraph",
      text: "The list changes occasionally. Until a 2022 reform, kanji that denote numbers or positions (一, 二, 三, 今) were banned in names; the Ministry of Justice relaxed the rule, which is why you now occasionally meet a child named 三月 or 一翔. Characters considered violent or inappropriate — 汚 (filthy), 死 (death), 性 (sex) — remain off-limits, and a registrar can reject a written form outright.",
    },
    { type: "heading", text: "4. Readings, however, are the wild west" },
    {
      type: "paragraph",
      text: "Kanji choices are regulated; how you read them is not. Parents must register a reading (in kana) alongside the kanji, but the pairing can be remarkably creative. The famous example reported across Japanese media is a boy registered as 光宙 — \"glow\" plus \"cosmos\" — with the reading Pikachu. Nicknamed kirakira (sparkly) names, these stretch the system: the law constrains the characters, not the sound attached to them.",
    },
    {
      type: "paragraph",
      text: "Most parents stay conventional, but the loophole explains two things at once: why Japanese names resist automated guessing, and why a name should always be checked with the reading before you assume how it is pronounced.",
    },
    { type: "heading", text: "5. Gendered endings — soft patterns, not rules" },
    {
      type: "paragraph",
      text: "Nothing in the law marks a name as male or female, but phonetic patterns are strong. Names ending in -ko (花子 Hanako, 恵子 Keiko), -mi (愛美 Manami), -ka (花華 Hana-ka), or -na (結菜 Yuna) read as feminine; names ending in -rō (太郎 Tarō), -ta (颯太 Sōta), -hiko (明彦 Akihiko), or -suke (助/佑輔) read as masculine. A shared stock of unisex names — Ren, Aoi, Hikaru, Yuki, Hinata — sits in the middle, and their gender balance drifts by decade.",
    },
    {
      type: "paragraph",
      text: "Treat these as strong conventions, not laws: plenty of real people sit outside them, and the Unisex Japanese Names guide covers the gray zone in detail.",
    },
    { type: "heading", text: "6. Families reuse characters across generations" },
    {
      type: "paragraph",
      text: "Many families pass a single character through siblings or across generations, the way Western families reuse middle names. A first son might be 健太 (Kenta), his brothers 健吾 (Kengo) and 健二 (Kenji) — all sharing 健, the strong-and-healthy character. Girls' names often share a character instead: 愛美 (Manami) and 愛梨 (Airi). The character is called a 通字 (tsūji), and spotting it explains why some families' names feel rhymed.",
    },
    { type: "heading", text: "7. No middle names — and one surname per household" },
    {
      type: "list",
      items: [
        "Japan has no middle names. The register records exactly one surname and one given name.",
        "The Civil Code requires a married couple to share a single registered surname; a 2021 Supreme Court decision upheld the rule. In practice roughly 95% of couples register under the husband's surname, though many women keep a maiden name in daily professional use (通称, tsūshō).",
        "Foreigners who naturalize take a Japanese-registerable name; permanent residents keep their legal foreign name but often adopt a Japanese alias (通名) for local convenience.",
      ],
    },
    { type: "heading", text: "8. Why there are so many surnames" },
    {
      type: "paragraph",
      text: "Most Japanese surnames are small landscape maps: 高橋 (high bridge), 山本 (mountain base), 田中 (middle of the rice field), 清水 (clear water). Commoners needed permission to bear surnames through the Edo period, and when the Meiji government required every household to register one in 1875, villagers simply named themselves after what they could see. The result is one of the densest surname stocks on earth — well over 100,000 distinct spellings — dominated by a top ten that covers roughly a tenth of the population.",
    },
    {
      type: "paragraph",
      text: "Our [Japanese last names collection](/japanese-last-names) profiles over 200 surnames with origin notes and regional maps, and the [100 most common Japanese surnames](/articles/most-common-japanese-surnames) article explains the big names in order.",
    },
    { type: "heading", text: "9. Stroke-count fortune telling" },
    {
      type: "paragraph",
      text: "A purely Japanese habit worth knowing: 姓名判断 (seimeihandan) scores a full name by the stroke count of its kanji, scoring combinations for fortune. It has no legal standing and no scientific basis, but it still influences real choices — some parents ask for the tally before registering, and publishers sell annual \"good stroke\" name books. If a Japanese friend reacts to a name suggestion by counting strokes on their fingers, that is what is happening.",
    },
    { type: "heading", text: "10. What is trending right now" },
    {
      type: "paragraph",
      text: "Recent annual surveys of newborn names show a consistent pattern: short, bright-sounding names with sun, light, or nature kanji top the lists — readings like Haruto, Ao, Himari, and Rin, each spread across several legal spellings. Pure-hiragana names keep growing, and so do two-character girls' names ending in a soft vowel. The specifics shift every year; our [most popular Japanese names](/articles/most-popular-japanese-names) guide rounds up the recent front-runners.",
    },
  ],
  faq: [
    {
      question: "Do Japanese names really come surname first?",
      answer:
        "Yes. The family name precedes the given name in all Japanese-language contexts: Tanaka Yuki is surname Tanaka, given name Yuki. English-language contexts often reverse it, which is why international media show Yuki Tanaka.",
    },
    {
      question: "Can any kanji be used in a Japanese name?",
      answer:
        "No. Name kanji must come from the jōyō kanji (2,136 characters) plus the jinmeiyō kanji list of roughly 860 personal-name characters. Hiragana and katakana are also permitted. Registrars can reject written forms deemed inappropriate.",
    },
    {
      question: "Is a name's meaning fixed by the sound?",
      answer:
        "No. The meaning attaches to the kanji spelling, not the sound. Haruto written 陽翔 (sun + soar) and Haruto written 悠斗 are different names with different imagery that merely share a pronunciation.",
    },
    {
      question: "Why do married couples in Japan share a surname?",
      answer:
        "The Civil Code requires one registered surname per household, and the Supreme Court upheld the rule in 2021. About 95% of couples register under the husband's name; professional maiden names remain common in daily use.",
    },
    {
      question: "What are kirakira names?",
      answer:
        "Literally 'sparkly' names: unusual readings attached to legal kanji, such as 光宙 read as Pikachu. Kanji choices are regulated by law, but readings are registered in kana and are not phonetically restricted, which leaves room for creative pairings.",
    },
    {
      question: "Do the Japanese use middle names?",
      answer:
        "No. The family register records one surname and one given name only. Generational identity is often expressed instead by reusing a kanji character across siblings or generations.",
    },
  ],
};
