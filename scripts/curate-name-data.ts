import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ImportedCandidate } from "./import-jmnedict";
import type { FirstNameRecord, SurnameRecord } from "../src/types/names";

type Group = {
  hiragana: string;
  katakana: string;
  romaji: string;
  genders: Set<"girl" | "boy" | "unisex">;
  candidates: ImportedCandidate[];
};

const inputPath = resolve("src/data/generated/candidates/jmnedict-candidates.json");
const outputPath = resolve("src/data/generated/curated/name-data.ts");
const wantedGivenKanji = ["月", "愛", "桜", "花", "光", "空", "海", "美"];
const wantedSurnameKanji = ["山", "田", "川", "中", "木", "本", "林", "島"];
const nameTargetMinimums: Record<string, number> = { 月: 10, 愛: 12, 桜: 10, 花: 14, 光: 10, 空: 8, 海: 10, 美: 22 };
const surnameTargetMinimums: Record<string, number> = { 山: 18, 田: 24, 川: 15, 中: 15, 木: 15, 本: 12, 林: 10, 島: 10 };
// Usability ordering only—not a popularity claim. Every selected pair must
// still exist directly in JMnedict.
const preferredGivenReadings = new Set([
  "あい", "あいこ", "あおい", "あかり", "あき", "あきこ", "あきら", "あさひ", "あすか", "あつし",
  "あや", "あやか", "あやこ", "あゆむ", "えま", "えみ", "えり", "えりか", "かえで", "かい",
  "かいと", "かな", "かなこ", "かなた", "かほ", "きょうこ", "くみ", "けい", "けいこ", "けいた",
  "けん", "けんじ", "けんた", "こころ", "こはる", "こう", "こうき", "こうた", "さき", "さくら",
  "さとし", "さな", "さや", "しおり", "しゅう", "しゅん", "しょう", "しょうた", "しん", "すず",
  "すみれ", "そう", "そうた", "たかし", "たくみ", "たけし", "だいき", "だいすけ", "ちなつ", "つばさ",
  "つむぎ", "なお", "なおき", "なな", "ななみ", "なつき", "なつみ", "のぞみ", "はな", "はやと",
  "はる", "はるか", "はるき", "はると", "ひかり", "ひかる", "ひな", "ひなた", "ひまり", "ひろき",
  "ひろし", "ほのか", "まい", "まお", "まこと", "まさき", "まさと", "みお", "みか", "みき",
  "みさき", "みずき", "みなと", "みなみ", "みゆ", "みゆき", "めい", "ももか", "やまと", "ゆい",
  "ゆう", "ゆうき", "ゆうた", "ゆうと", "ゆか", "ゆき", "ゆな", "りお", "りか", "りく",
  "りくと", "りこ", "りな", "りょう", "りょうた", "りん", "れい", "れいな", "れお", "れん", "わたる",
]);
const preferredSurnamePairs = new Set([
  "佐藤:さとう", "鈴木:すずき", "高橋:たかはし", "田中:たなか", "伊藤:いとう", "渡辺:わたなべ",
  "山本:やまもと", "中村:なかむら", "小林:こばやし", "加藤:かとう", "吉田:よしだ", "山田:やまだ",
  "佐々木:ささき", "山口:やまぐち", "松本:まつもと", "井上:いのうえ", "木村:きむら", "林:はやし",
  "斎藤:さいとう", "清水:しみず", "山崎:やまざき", "森:もり", "池田:いけだ", "橋本:はしもと",
  "阿部:あべ", "石川:いしかわ", "山下:やました", "中島:なかじま", "石井:いしい", "小川:おがわ",
  "前田:まえだ", "岡田:おかだ", "長谷川:はせがわ", "藤田:ふじた", "後藤:ごとう", "近藤:こんどう",
  "村上:むらかみ", "遠藤:えんどう", "青木:あおき", "坂本:さかもと", "斉藤:さいとう", "福田:ふくだ",
  "太田:おおた", "西村:にしむら", "藤井:ふじい", "岡本:おかもと", "藤原:ふじわら", "三浦:みうら",
  "中川:なかがわ", "松田:まつだ", "竹内:たけうち", "原田:はらだ", "中野:なかの", "小野:おの",
  "田村:たむら", "金子:かねこ", "和田:わだ", "中山:なかやま", "石田:いしだ", "上田:うえだ",
]);

function idPart(value: string) {
  return value.normalize("NFC").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "name";
}

function displayRomaji(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : "Unspecified";
}

function stableSuffix(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function validWrittenName(value: string) {
  return /^[\p{Script=Han}々ヶ]+$/u.test(value);
}

function chooseGroups(groups: Group[], gender: "girl" | "boy" | "unisex", count: number) {
  return groups
    .filter((group) => group.genders.has(gender))
    .sort((a, b) => {
      const score = (group: Group) => wantedGivenKanji.reduce(
        (total, kanji) => total + Number(group.candidates.some((item) => item.kanji.includes(kanji))), 0,
      );
      return Number(preferredGivenReadings.has(b.hiragana)) - Number(preferredGivenReadings.has(a.hiragana)) || score(b) - score(a) || a.hiragana.localeCompare(b.hiragana, "ja");
    })
    .slice(0, count);
}

function variationSort(kanji: string) {
  const targetScore = wantedGivenKanji.reduce((score, target) => score + Number(kanji.includes(target)), 0);
  return -targetScore * 100 + [...kanji].length;
}

async function main() {
  const candidates = JSON.parse(await readFile(inputPath, "utf8")) as ImportedCandidate[];
  const groups = new Map<string, Group>();
  for (const candidate of candidates) {
    if (candidate.kind === "surname" || !validWrittenName(candidate.kanji) || !/^[ぁ-ゖ]+$/u.test(candidate.hiragana)) continue;
    const group = groups.get(candidate.hiragana) ?? {
      hiragana: candidate.hiragana,
      katakana: candidate.katakana,
      romaji: candidate.romaji,
      genders: new Set(),
      candidates: [],
    };
    if (candidate.kind === "female") group.genders.add("girl");
    if (candidate.kind === "male") group.genders.add("boy");
    // JMnedict `given` is an unclassified given-name entry, not evidence that
    // a reading is used by all genders.
    group.candidates.push(candidate);
    groups.set(candidate.hiragana, group);
  }
  for (const group of groups.values()) {
    if (group.genders.has("girl") && group.genders.has("boy")) {
      group.genders.add("unisex");
    }
  }
  const allGroups = [...groups.values()].filter((group) => group.genders.size > 0);
  const selectedGroups = new Map<string, Group>();
  for (const group of chooseGroups(allGroups, "girl", 140)) selectedGroups.set(group.hiragana, group);
  for (const group of chooseGroups(allGroups, "boy", 140)) selectedGroups.set(group.hiragana, group);
  for (const group of chooseGroups(allGroups, "unisex", 60)) selectedGroups.set(group.hiragana, group);

  // Guarantee shortcut coverage first; all selected written forms remain direct JMnedict pairs.
  for (const target of wantedGivenKanji) {
    const matches = allGroups.filter((group) => group.candidates.some((item) => item.kanji.includes(target)))
      .sort((a, b) => a.hiragana.localeCompare(b.hiragana, "ja"));
    for (const group of matches.slice(0, nameTargetMinimums[target])) selectedGroups.set(group.hiragana, group);
  }

  const firstNames: FirstNameRecord[] = [...selectedGroups.values()]
    .sort((a, b) => a.hiragana.localeCompare(b.hiragana, "ja"))
    .map((group) => {
      const variationMap = new Map<string, ImportedCandidate>();
      for (const candidate of group.candidates.sort((a, b) => a.kanji.localeCompare(b.kanji, "ja"))) {
        if (!variationMap.has(candidate.kanji)) variationMap.set(candidate.kanji, candidate);
      }
      const variations = [...variationMap.values()]
        .sort((a, b) => variationSort(a.kanji) - variationSort(b.kanji) || a.kanji.localeCompare(b.kanji, "ja"))
        .slice(0, 2)
        .map((candidate) => ({
          kanji: candidate.kanji,
          meanings: ["Meaning not yet reviewed"],
          kanjiBreakdown: [],
          naturalness: "medium" as const,
          verificationStatus: "partially_verified" as const,
        }));
      const upstreamIds = [...new Set([...variationMap.values()].map((item) => item.upstreamEntryId))];
      const stableId = `${idPart(group.romaji)}-${stableSuffix(group.hiragana)}`;
      return {
        id: `jmnedict-name-${stableId}`,
        slug: stableId,
        romaji: displayRomaji(group.romaji),
        hiragana: group.hiragana,
        katakana: group.katakana,
        genders: [...group.genders],
        styles: [],
        meaningTags: [],
        popularityLevel: "unranked" as const,
        kanjiLengthOptions: [...new Set(variations.map((item) => [...item.kanji].length))],
        variations,
        compatibleSurnameIds: [],
        verificationStatus: "partially_verified" as const,
        generatorEligible: true,
        curationPriority: preferredGivenReadings.has(group.hiragana) ? "recommended" as const : "extended" as const,
        candidateStatus: "partially_verified" as const,
        reviewNotes: "JMnedict directly records the kanji-reading pair; popularity, style, and naming intent remain unreviewed.",
        upstreamIds,
        classificationBasis: "JMnedict name_type classification",
        sourceIds: ["edrdg-jmnedict-2026-08-01"],
        isIndexable: false,
      };
    })
    .filter((item) => item.variations.length > 0);

  const surnamePool = candidates
    .filter((candidate) => candidate.kind === "surname" && validWrittenName(candidate.kanji) && /^[ぁ-ゖ]+$/u.test(candidate.hiragana));
  const uniqueSurnames = [...new Map(surnamePool.map((item) => [`${item.kanji}:${item.hiragana}`, item])).values()];
  const selectedSurnames = new Map<string, ImportedCandidate>();
  for (const target of wantedSurnameKanji) {
    for (const surname of uniqueSurnames.filter((item) => item.kanji.includes(target)).sort((a, b) => a.kanji.localeCompare(b.kanji, "ja")).slice(0, surnameTargetMinimums[target])) {
      selectedSurnames.set(`${surname.kanji}:${surname.hiragana}`, surname);
    }
  }
  for (const surname of uniqueSurnames.filter((item) => preferredSurnamePairs.has(`${item.kanji}:${item.hiragana}`)).sort((a, b) => a.kanji.localeCompare(b.kanji, "ja"))) {
    selectedSurnames.set(`${surname.kanji}:${surname.hiragana}`, surname);
  }
  for (const surname of uniqueSurnames.sort((a, b) => a.kanji.localeCompare(b.kanji, "ja"))) {
    if (selectedSurnames.size >= 220) break;
    selectedSurnames.set(`${surname.kanji}:${surname.hiragana}`, surname);
  }
  const surnames: SurnameRecord[] = [...selectedSurnames.values()]
    .sort((a, b) => a.kanji.localeCompare(b.kanji, "ja") || a.hiragana.localeCompare(b.hiragana, "ja"))
    .map((candidate) => {
      const stableId = `${idPart(candidate.romaji)}-${stableSuffix(`${candidate.kanji}:${candidate.hiragana}`)}`;
      return {
        id: `jmnedict-surname-${stableId}`,
        slug: stableId,
        kanji: candidate.kanji,
        hiragana: candidate.hiragana,
        katakana: candidate.katakana,
        romaji: displayRomaji(candidate.romaji),
        literalMeaning: "Origin meaning not yet reviewed.",
        summary: "JMnedict records this surname spelling and reading. Origin, popularity, and regional distribution are not asserted here.",
        kanjiBreakdown: [],
        popularityLevel: "unranked" as const,
        originTypes: ["uncertain" as const],
        originConfidence: "uncertain" as const,
        originIllustrationKey: "uncertain" as const,
        regions: [],
        timeline: [],
        compatibleFirstNameIds: [],
        verificationStatus: "partially_verified" as const,
        generatorEligible: true,
        curationPriority: preferredSurnamePairs.has(`${candidate.kanji}:${candidate.hiragana}`) ? "recommended" as const : "extended" as const,
        candidateStatus: "partially_verified" as const,
        reviewNotes: "JMnedict directly records the kanji-reading pair; origin, popularity, and distribution remain unreviewed.",
        upstreamIds: [candidate.upstreamEntryId],
        classificationBasis: "JMnedict name_type surname classification",
        sourceIds: ["edrdg-jmnedict-2026-08-01"],
        isIndexable: false,
      };
    });

  const contents = `/* Generated by scripts/curate-name-data.ts from JMnedict; do not hand-edit. */\n` +
    `import type { FirstNameRecord, SurnameRecord } from "@/types/names";\n\n` +
    `export const generatedFirstNames: FirstNameRecord[] = ${JSON.stringify(firstNames, null, 2)};\n\n` +
    `export const generatedSurnames: SurnameRecord[] = ${JSON.stringify(surnames, null, 2)};\n`;
  await mkdir(resolve("src/data/generated/curated"), { recursive: true });
  await writeFile(outputPath, contents);
  console.log(`Curated ${firstNames.length} readings, ${firstNames.reduce((total, name) => total + name.variations.length, 0)} variations, and ${surnames.length} surnames.`);
}

void main();
