import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  gender: ArticleNameEntry["gender"],
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, gender, note });

export const animeJapaneseNames: Article = {
  slug: "japanese-anime-names",
  title: "Japanese Anime Names: 16 Real Names from Anime (and the Ones to Avoid)",
  metaTitle: "Japanese Anime Names: Real Names to Use, Fictional Ones to Avoid",
  metaDescription:
    "Anime names split in two: real, registerable names like Sakura, Hinata, and Megumi — and invented ones like Rengoku and Uchiha. The breakdown, with kanji.",
  summary:
    "Sakura, Hinata, Megumi, Chihiro, Subaru — which anime names are real, registerable Japanese names, and which (Rengoku, Uchiha) exist only in fiction.",
  category: "lists",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["how-japanese-names-work", "most-popular-japanese-names", "cool-japanese-last-names"],
  intro: [
    "Anime names come in two very different varieties, and confusing them is the most common mistake people make when borrowing one. Some characters simply wear ordinary Japanese names — Sakura, Hinata, Megumi — that you could register for a child tomorrow. Others carry invented names built for drama: Rengoku, Uchiha, Zenitsu, names that sound fantastic and exist nowhere in Japan's family registers.",
    "This guide splits the two groups cleanly, with the kanji for the real names and an honest explanation of what the fictional ones are doing differently.",
  ],
  blocks: [
    { type: "heading", text: "Anime names that are real, registerable Japanese names" },
    {
      type: "paragraph",
      text: "Every name in this section is a normal Japanese given name — legal kanji, ordinary readings, real people named them long before and after their characters appeared.",
    },
    {
      type: "nameEntries",
      entries: [
        e("Sakura", "桜", "さくら", "girl", "Naruto's Sakura Haruno, Cardcaptor Sakura, and a dozen more. The name itself is the cherry blossom — a girls' top-20 staple for decades."),
        e("Hinata", "陽向", "ひなた", "unisex", "Naruto's Hinata Hyuga and Haikyu's Hinata Shoyo. A genuinely unisex reading — sunny spot — that anime pushed to the top of both gender charts."),
        e("Yuki", "雪", "ゆき", "unisex", "Fruits Basket's Yuki, and dozens more. Snow or happiness depending on the kanji; a unisex top-100 name independent of any series."),
        e("Megumi", "恵", "めぐみ", "unisex", "Jujutsu Kaisen's Megumi Fushiguro. Blessing or grace — a unisex name with a long history outside anime."),
        e("Yuji", "悠仁", "ゆうじ", "boy", "Jujutsu Kaisen's Yuji Itadori. 悠二 and 勇治 are the common spellings — an ordinary boy name of the 1990s-2000s generation."),
        e("Asuna", "明日奈", "あすな", "girl", "Sword Art Online's heroine. Written 明日奈 — 'tomorrow' — it reads as a modern, slightly literary girl name."),
        e("Chihiro", "千尋", "ちひろ", "unisex", "Spirited Away's heroine. A thousand fathoms (千尋) — depth upon depth. A real unisex name both before and after the film."),
        e("Subaru", "昴", "すばる", "boy", "Re:Zero's hero and the Pleiades star cluster. Registerable and in use, though the car brand still shadows it."),
        e("Kazuma", "和真", "かずま", "boy", "KonoSuba's hero. 和真 — harmony and truth — is an ordinary spelling of an ordinary boy name."),
        e("Rei", "玲", "れい", "unisex", "Evangelion's Rei Ayanami, Sailor Mars, and more. 玲 (tinkling jade), 麗 (lovely), 零 (zero — for the Evangelion effect). All real readings."),
        e("Asuka", "飛鳥", "あすか", "girl", "Evangelion's Asuka Langley and many others. The flying bird of the Asuka period — a real, historic girl name."),
        e("Hikaru", "光", "ひかる", "unisex", "Hikaru no Go's hero. To shine — a unisex classic, no anime required."),
        e("Kaoru", "薫", "かおる", "unisex", "Rurouni Kenshin's Kaoru Kamiya. Fragrance — a literary unisex name of long standing."),
        e("Haruka", "遥", "はるか", "unisex", "Sailor Moon's Haruka Tenoh and countless others. Distant (遥) — a 1990s girl-name staple that also registers for boys."),
        e("Michiru", "満", "みちる", "girl", "Sailor Moon's Sailor Neptune. To be full, complete (満) — rare but real."),
        e("Shizuku", "雫", "しずく", "girl", "Whisper of the Heart's heroine. A water droplet (雫) — a kanji created in Japan, poetic and registerable."),
      ],
    },
    { type: "heading", text: "Fictional names to admire, not borrow" },
    {
      type: "paragraph",
      text: "These exist only inside their series. Some are impossible to register (the kanji or reading violates naming rules); others are legal but would mark a child unmistakably. If you are naming a fictional character of your own, they are exactly the right inspiration — our [name generator](/) has a fiction-friendly mode for this.",
    },
    {
      type: "list",
      items: [
        "Rengoku 煉獄 (Demon Slayer): the surname literally reads 'purgatory.' Powerful, dramatic, and not a family register name.",
        "Uchiha うちは (Naruto): the clan name is written without standard surname kanji — it is an invented name, iconic and unregistered.",
        "Zenitsu 我妻善逸 (Demon Slayer): the given name combines 善 (good) and 逸 (superior), but its old-fashioned sound-plus-kanji pairing exists only in the story.",
        "Nezuko 禰豆子 (Demon Slayer): the 禰 character is not in the approved name-kanji list — literally unregisterable as written.",
        "Kamado 竈門 (Demon Slayer): 'hearth door' — a real rare surname shape, but the Tanjiro (炭治郎, 'charcoal') given name is a story invention.",
        "Mikasa 三笠 (Attack on Titan): actually a real surname (a mountain, a warship, a borough in Hokkaido) — but 'Mikasa Ackerman' mixes registers in a way no Japanese name would.",
        "Kirito キリト (Sword Art Online): a player avatar name written in katakana — the character's real name, Kazuto, is the registerable one.",
        "Kagome かごめ (Inuyasha): a game-song word ('birdcage weave'), not a conventional name; the fiction is the point.",
      ],
    },
    {
      type: "callout",
      title: "Why anime names sound different",
      text: "Anime naming optimizes for drama: unusual readings, evocative kanji, and surnames that double as imagery (purgatory, hearth, snow). Real naming optimizes for a child's daily life. That gap is a feature of the medium — and a trap for anyone borrowing a name at face value.",
    },
  ],
  faq: [
    {
      question: "Can I name my child after an anime character?",
      answer:
        "Yes, if the character has a real name. Sakura, Hinata, Megumi, Chihiro, Subaru, and Yuji are ordinary registerable Japanese names that happen to belong to famous characters. Invented names like Rengoku or Nezuko are not registerable as written.",
    },
    {
      question: "Is Hinata popular because of Naruto?",
      answer:
        "Naruto gave the reading enormous visibility, but Hinata was already a real unisex name. Recent rankings show it charting for both boys and girls — anime lifted a genuine name rather than inventing one.",
    },
    {
      question: "What does the name Rengoku mean?",
      answer:
        "Rengoku (煉獄) is the Japanese word for purgatory — 'refining fire.' It is a Demon Slayer invention, dramatic by design, and not a name found in Japanese family registers.",
    },
    {
      question: "Is Sakura a real name outside of anime?",
      answer:
        "Yes — Sakura is one of the most consistently popular Japanese girl names of the last thirty years, written 桜 or 咲良. Anime borrowed it far more than it created it.",
    },
    {
      question: "Why do anime characters have strange surnames?",
      answer:
        "Fiction uses surnames as characterization: Rengoku (purgatory), Uchiha, Kamado (hearth door). Real Japanese surnames are mostly landscape names — bridges, mountains, rice fields — precisely because they had to function for a whole family's daily life.",
    },
    {
      question: "What are good anime-style names for fictional characters?",
      answer:
        "Start from real names and push one attribute: an uncommon kanji pairing, a nature image, or an old-fashioned sound. Our name generator's fiction-friendly mode is built for exactly this trade-off.",
    },
  ],
};
