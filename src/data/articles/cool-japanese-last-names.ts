import type { Article, ArticleNameEntry } from "@/types/articles";

const e = (
  romaji: string,
  kanji: string,
  kana: string,
  note: string,
): ArticleNameEntry => ({ romaji, kanji, kana, note, kind: "surname" });

export const coolJapaneseLastNames: Article = {
  slug: "cool-japanese-last-names",
  title: "Cool Japanese Last Names: Dark, Rare, and Dramatic Surnames",
  metaTitle: "Cool Japanese Last Names: Dark & Rare Surnames with Meanings",
  metaDescription:
    "Cool Japanese surnames with dramatic meanings — Kurosawa (black swamp), Kageyama (shadow mountain), Shiranui (unknown fire) — real names for characters.",
  summary:
    "Kurosawa, Kageyama, Shiranui, Arakawa — real Japanese surnames with dark and dramatic meanings, plus the fictional ones to recognize on sight.",
  category: "lists",
  publishedAt: "2026-10-29",
  updatedAt: "2026-10-29",
  related: ["most-common-japanese-surnames", "japanese-anime-names", "how-japanese-names-work"],
  intro: [
    "The surnames that feel 'cool' in Japanese share one trick: they take the ordinary landscape vocabulary of Japanese family names — mountains, swamps, rivers — and point it at the dramatic end of nature. Black swamps, shadow mountains, unknown fires, wild rivers. Almost all of them are real names, worn by real families, and most are far rarer than Kurosawa's pop-culture fame suggests.",
    "Every surname below is registerable and attested; rarity varies. The notes give the literal landscape reading and the pop-culture echo, if there is one. And for fiction writers: at the end there is a short list of invented anime surnames that are famous precisely because they are not real.",
  ],
  blocks: [
    { type: "heading", text: "Dark and shadow names" },
    {
      type: "nameEntries",
      entries: [
        e("Kurosawa", "黒沢", "くろさわ", "Black swamp (黒沢) — home of Japan's most celebrated film director, which is why the name reads as cinematic before it reads as dark. Variant spelling 黒澤."),
        e("Kuroda", "黒田", "くろだ", "Black rice field (黒田) — the name of a daimyo clan and several prime ministers. Darkness plus farmland: the two halves of Japanese naming in one."),
        e("Kuroki", "黒木", "くろき", "Black tree (黒木). A real and reasonably common surname — the dark-wood grove at the village edge."),
        e("Kurosaki", "黒崎", "くろさき", "Black promontory (黒崎), the Bleach hero's surname and a real place name in Kitakyushu."),
        e("Kurokawa", "黒川", "くろかわ", "Black river (黒川) — a dark streambed, and a genuinely common surname despite the gothic sound."),
        e("Kageyama", "影山", "かげやま", "Shadow mountain (影山) — Haikyu's grumpy setter made it world-famous. Real, attested, and dramatic for free."),
        e("Kurono", "黒野", "くろの", "Black field (黒野): the dark plain. Rarer than the Kuro- names above, equally crisp."),
        e("Kurotani", "黒谷", "くろたに", "Black valley (黒谷) — a shaded ravine name, quiet and moody."),
        e("Tsukikage", "月影", "つきかげ", "Moon shadow (月影) — moonlight in classical poetry. Rare as a surname, unforgettable as an image."),
        e("Yagami", "八神", "やがみ", "Eight gods (八神) — a real surname; Death Note spelled its antihero's name with 夜神, 'night god,' for fiction. The real kanji are older and more temple-than-thriller."),
      ],
    },
    { type: "heading", text: "Storm, fire, and thunder names" },
    {
      type: "nameEntries",
      entries: [
        e("Arakawa", "荒川", "あらかわ", "Wild river (荒川) — Tokyo's great flood-prone river gave the name its drama. Real and common in the capital's north."),
        e("Arashi", "嵐", "あらし", "Storm (嵐). A real rare surname — and the name of Japan's biggest boy band, which owns the word in most contexts."),
        e("Shiranui", "不知火", "しらぬい", "The 'unknown fire' (不知火) — mysterious lights seen over the sea in Kyushu folklore. A real rare surname with mythic atmosphere built in."),
        e("Narukami", "鳴神", "なるかみ", "Thundering god (鳴神) — thunder as a family name. Rare, mythic, and attested."),
        e("Akatsuki", "暁", "あかつき", "Daybreak (暁) — the moment before sunrise. A rare surname and given name both; dawn rather than darkness, but the same drama."),
        e("Akabane", "赤羽", "あかばね", "Red feather (赤羽) — a Tokyo district and a real surname with a martial ring."),
        e("Akagi", "赤城", "あかぎ", "Red castle hill (赤城) — the Gunma volcano, the warship, and the racing legend. Red meets mountain."),
        e("Kurenai", "紅", "くれない", "Deep crimson (紅) — the dye color of the Heian court. A rare, jewel-box surname."),
        e("Amakusa", "天草", "あまくさ", "Heavenly grass (天草) — the Kyushu peninsula where the Shimabara rebellion ended. Regional, historic, heavy with story."),
      ],
    },
    { type: "heading", text: "Moon, star, and night names" },
    {
      type: "nameEntries",
      entries: [
        e("Hoshino", "星野", "ほしの", "Star field (星野) — a reasonably common surname that reads like a line of poetry. Our collection profiles it with a regional map."),
        e("Hoshikawa", "星川", "ほしかわ", "Star river (星川): a stream under the stars. Real and moderately common."),
        e("Tsukino", "月野", "つきの", "Moon field (月野) — rare as a surname, better known as a given-name reading and a Sailor Moon surname (Tsukino Usagi)."),
        e("Tsukioka", "月岡", "つきおか", "Moon hill (月岡) — the surname of the Meiji print artist Tsukioka Yoshitoshi. Rare and artistic."),
        e("Izayoi", "十六夜", "いざよい", "The sixteenth-night moon (十六夜) — the moon that hesitates ('iza-yoi', tempting to stay out) as it wanes. A poetic rarity."),
        e("Tsukuyomi", "月読", "つくよみ", "The Shinto moon god's name, held by a handful of real families. Mythology at surname weight."),
        e("Amamiya", "雨宮", "あまみや", "Rain shrine (雨宮) — a shrine where rain was prayed for, weather mythology as an address. Real and moderately common, with a sound anime fans know well."),
      ],
    },
    {
      type: "callout",
      title: "The famous fictional surnames — know them on sight",
      text: "Uchiha (Naruto), Rengoku 煉獄 — literally 'purgatory' — (Demon Slayer), Senju (Naruto), and Kuchiki (Bleach) are invented names: no Japanese family register holds them. They are superb inspiration for your own characters — our [name generator](/) has a fiction-friendly mode for exactly this — but they are not 'rare real surnames,' whatever the listicles say.",
    },
    {
      type: "paragraph",
      text: "If your taste runs quieter, the [100 most common Japanese surnames](/articles/most-common-japanese-surnames) show the everyday landscape this dramatic end of the vocabulary grows from — and our [Japanese last names collection](/japanese-last-names) profiles 220 real surnames with origin notes and prefecture maps.",
    },
  ],
  faq: [
    {
      question: "What are some cool Japanese last names with dark meanings?",
      answer:
        "Kurosawa (黒沢, black swamp), Kuroda (黒田, black rice field), Kageyama (影山, shadow mountain), Kuroki (黒木, black tree), and Tsukikage (月影, moon shadow) are all real attested surnames built on darkness and shadow kanji.",
    },
    {
      question: "Is Kageyama a real Japanese surname?",
      answer:
        "Yes. Kageyama (影山, shadow mountain) is an attested Japanese surname — Haikyu's setter made it famous, but real families hold it, particularly around Nagano and Shizuoka.",
    },
    {
      question: "Are anime surnames like Uchiha and Rengoku real?",
      answer:
        "No. Uchiha, Rengoku (煉獄, 'purgatory'), Senju, and Kuchiki are fictional inventions — powerful by design and absent from Japanese family registers. Real alternatives with similar atmosphere include Kurosaki, Kuroda, and Shiranui.",
    },
    {
      question: "What does Shiranui mean?",
      answer:
        "Shiranui (不知火) means 'unknown fire' — the mysterious lights that appear over the Yatsushiro Sea in Kyushu folklore. It is a real rare surname and a striking one.",
    },
    {
      question: "What is the rarest cool Japanese surname?",
      answer:
        "Among dramatic names, Izayoi (十六夜, the sixteenth-night moon), Narukami (鳴神, thundering god), and Tsukikage (月影, moon shadow) are genuinely scarce. Japan's rarest surnames overall are one-family names — over a hundred thousand spellings exist for a population of 125 million.",
    },
    {
      question: "Can I use a Japanese surname for a fictional character?",
      answer:
        "Yes — that is what they are for in fiction worldwide. Real dramatic surnames like Kurosawa or Arakawa ground a character; invented ones like Uchiha signal anime lineage. Either is fine on the page; only naturalization makes it legal in Japan.",
    },
  ],
};
