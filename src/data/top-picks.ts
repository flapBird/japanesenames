import type { ArticleNameEntry } from "@/types/articles";

// Hub-page "top picks": editorial entries whose kanji are verified against the
// dataset records they link to (the resolver matches kana, preferring an exact
// kanji variation), so the card a visitor sees matches the detail page.
export const topGirlPicks: ArticleNameEntry[] = [
  { romaji: "Rin", kanji: "凛", kana: "りん", gender: "girl", note: "Dignified composure — cold air that snaps clean. One crisp syllable; the collection also records 琳, a beautiful jewel." },
  { romaji: "Hana", kanji: "花", kana: "はな", gender: "girl", note: "Flower, one character and done — and a name that works in English almost unchanged." },
  { romaji: "Akari", kanji: "灯", kana: "あかり", gender: "girl", note: "A lamp's flame. The collection also records 明里, bright village — same reading, different image." },
  { romaji: "Hikari", kanji: "光", kana: "ひかり", gender: "unisex", note: "Light itself, a single luminous character that also reads unisex." },
  { romaji: "Yui", kanji: "結衣", kana: "ゆい", gender: "girl", note: "To tie (結) + garment (衣): a knot of cloth — connection you can hold." },
  { romaji: "Kaede", kanji: "楓", kana: "かえで", gender: "girl", note: "Maple — the tree whose autumn color the whole country travels to see." },
  { romaji: "Aoi", kanji: "葵", kana: "あおい", gender: "unisex", note: "Hollyhock, the Tokugawa crest plant — a top-10 name for girls and boys at once." },
  { romaji: "Minato", kanji: "湊", kana: "みなと", gender: "unisex", note: "Harbor: where boats — and families — find shelter. Rides the recent single-character boom." },
  { romaji: "Himari", kanji: "光葵", kana: "ひまり", gender: "girl", note: "This collection records the light-plus-hollyhock spelling 光葵; the reading is most famously written 陽葵, sun plus hollyhock." },
  { romaji: "Hina", kanji: "光花", kana: "ひな", gender: "girl", note: "Recorded here as light (光) + flower (花); the reading Hina is also commonly written 陽菜, sun on young greens." },
  { romaji: "Mio", kanji: "海桜", kana: "みお", gender: "girl", note: "Sea cherry blossom in this collection's spelling — alongside 光桜, light cherry blossom. Elegant and compact." },
  { romaji: "Momoka", kanji: "桃花", kana: "ももか", gender: "unisex", note: "Peach blossom — spring, sweetness, and a touch of Momotaro folklore. 杏花, apricot blossom, is the alternate spelling." },
];

export const topBoyPicks: ArticleNameEntry[] = [
  { romaji: "Haruto", kanji: "陽翔", kana: "はると", gender: "boy", note: "Sun (陽) + soaring flight (翔) — the defining boy name of the 2010s, still near the top." },
  { romaji: "Ren", kanji: "蓮", kana: "れん", gender: "unisex", note: "Lotus: the flower that rises clean out of the mud. A top boy name that also charts for girls." },
  { romaji: "Sota", kanji: "颯太", kana: "そうた", gender: "boy", note: "颯 carries wind and dash; 太 adds sturdy. The long vowel is why romaji sometimes shows Sōta." },
  { romaji: "Minato", kanji: "湊", kana: "みなと", gender: "unisex", note: "Harbor in one character — a place of safety that doubled as a modern naming phenomenon." },
  { romaji: "Aoi", kanji: "葵", kana: "あおい", gender: "unisex", note: "Hollyhock, the sacred Tokugawa crest plant — equally at home on boys' and girls' registers." },
  { romaji: "Takumi", kanji: "匠", kana: "たくみ", gender: "boy", note: "Master artisan — craftsmanship as a given name." },
  { romaji: "Kenji", kanji: "健二", kana: "けんじ", gender: "boy", note: "Healthy (健) + second (二) — the classic formed name; the 二 does not guarantee a second son." },
  { romaji: "Hinata", kanji: "日向", kana: "ひなた", gender: "unisex", note: "A sunny spot, literally: facing the sun (陽向 is the alternate spelling). Warm for any gender." },
  { romaji: "Daiki", kanji: "太喜", kana: "だいき", gender: "boy", note: "Great joy (太喜) in this collection's spelling; 太基 and 大輝 are the other common forms." },
  { romaji: "Hayato", kanji: "隼", kana: "はやと", gender: "unisex", note: "Falcon — swift and sharp-eyed. 隼人 (falcon + person) is the fuller traditional spelling." },
  { romaji: "Kaito", kanji: "海音", kana: "かいと", gender: "unisex", note: "Ocean + sound in this collection; the charting classic spelling is 海翔, flying over the sea." },
  { romaji: "Riku", kanji: "璃空", kana: "りく", gender: "unisex", note: "Crystal (璃) + sky (空) in this collection's spelling — the reading is most often written 陸, land." },
];

export const topSurnamePicks: ArticleNameEntry[] = [
  { romaji: "Sato", kanji: "佐藤", kana: "さとう", kind: "surname", note: "Japan's most common surname — roughly one person in 65. Helper + wisteria, the Fujiwara clan's emblem." },
  { romaji: "Suzuki", kanji: "鈴木", kana: "すずき", kind: "surname", note: "Bell + tree: ritual bells hung on sacred trees at shrines. The signature surname of central Japan." },
  { romaji: "Takahashi", kanji: "高橋", kana: "たかはし", kind: "surname", note: "High bridge — bridges crossed sacred boundaries, so bridge names often mark shrine villages." },
  { romaji: "Tanaka", kanji: "田中", kana: "たなか", kind: "surname", note: "Middle of the rice field: the household that lived out among the paddies." },
  { romaji: "Watanabe", kanji: "渡辺", kana: "わたなべ", kind: "surname", note: "To cross + area: descendants of the Minamoto clan that ran a famous Osaka river ferry." },
  { romaji: "Yamamoto", kanji: "山本", kana: "やまもと", kind: "surname", note: "Mountain base: the house at the foot of the mountain — geography as identity." },
  { romaji: "Nakamura", kanji: "中村", kana: "なかむら", kind: "surname", note: "Middle village: so generic it arose independently all over the country." },
  { romaji: "Kobayashi", kanji: "小林", kana: "こばやし", kind: "surname", note: "Small forest: the grove by the hamlet. Also read Obayashi depending on the family." },
  { romaji: "Shimizu", kanji: "清水", kana: "しみず", kind: "surname", note: "Clear water: often tied to a specific spring or shrine, including Kyoto's Kiyomizu-dera." },
  { romaji: "Mori", kanji: "森", kana: "もり", kind: "surname", note: "Forest — three trees stacked into one character, and one of the few single-kanji surnames." },
  { romaji: "Yamashita", kanji: "山下", kana: "やました", kind: "surname", note: "Below the mountain: the foot-of-the-hill household, pairing naturally with Yamamoto." },
  { romaji: "Ikeda", kanji: "池田", kana: "いけだ", kind: "surname", note: "Pond + rice field: paddies watered from the village pond — irrigation written into a name." },
];
