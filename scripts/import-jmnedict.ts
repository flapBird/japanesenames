import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createGunzip } from "node:zlib";
import { createInterface } from "node:readline";
import { basename, resolve } from "node:path";

type NameClass = "surname" | "female" | "male" | "given";

export interface ImportedCandidate {
  id: string;
  upstreamEntryId: string;
  kind: NameClass;
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  candidateStatus: "imported_unreviewed";
  sourceId: string;
}

const cachePath = resolve(".data-cache/jmnedict/JMnedict.xml.gz");
const outputPath = resolve("src/data/generated/candidates/jmnedict-candidates.json");
const manifestPath = resolve("data-sources/jmnedict/source-manifest.json");
const sourceId = "edrdg-jmnedict-2026-08-01";

function text(block: string, tag: string) {
  return [...block.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g"))]
    .map((match) => match[1].normalize("NFC"));
}

function kanaToKatakana(value: string) {
  return value.replace(/[ぁ-ゖ]/g, (character) =>
    String.fromCodePoint(character.codePointAt(0)! + 0x60),
  );
}

// Deterministic, intentionally conservative Hepburn transliteration for display slugs.
function toHepburn(kana: string) {
  const normalized = kana.normalize("NFC").replace(/[ー]/g, "-");
  const pairs: Record<string, string> = {
    きゃ: "kya", きゅ: "kyu", きょ: "kyo", しゃ: "sha", しゅ: "shu", しょ: "sho",
    ちゃ: "cha", ちゅ: "chu", ちょ: "cho", にゃ: "nya", にゅ: "nyu", にょ: "nyo",
    ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo", みゃ: "mya", みゅ: "myu", みょ: "myo",
    りゃ: "rya", りゅ: "ryu", りょ: "ryo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
    じゃ: "ja", じゅ: "ju", じょ: "jo", びゃ: "bya", びゅ: "byu", びょ: "byo",
    ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo", ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo",
  };
  const chars: Record<string, string> = {
    あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",
    さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",
    な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",
    ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",や:"ya",ゆ:"yu",よ:"yo",ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",
    わ:"wa",を:"o",ん:"n",が:"ga",ぎ:"gi",ぐ:"gu",げ:"ge",ご:"go",ざ:"za",じ:"ji",ず:"zu",ぜ:"ze",ぞ:"zo",
    だ:"da",ぢ:"ji",づ:"zu",で:"de",ど:"do",ば:"ba",び:"bi",ぶ:"bu",べ:"be",ぼ:"bo",ぱ:"pa",ぴ:"pi",ぷ:"pu",ぺ:"pe",ぽ:"po",
    ゔ:"vu",ゐ:"i",ゑ:"e",っ:"",
  };
  let result = "";
  for (let index = 0; index < normalized.length; index += 1) {
    const pair = normalized.slice(index, index + 2);
    if (pairs[pair]) { result += pairs[pair]; index += 1; continue; }
    const current = normalized[index];
    if (current === "っ") {
      const next = pairs[normalized.slice(index + 1, index + 3)] ?? chars[normalized[index + 1]] ?? "";
      result += next[0] ?? "";
    } else if (current === "-") {
      const last = result.at(-1); if (last && "aeiou".includes(last)) result += last;
    } else result += chars[current] ?? current;
  }
  return result.replace(/[^a-z]/g, "");
}

export function parseEntry(entry: string): ImportedCandidate[] {
  const upstreamEntryId = text(entry, "ent_seq")[0];
  if (!upstreamEntryId) return [];
  const types = [...entry.matchAll(/<name_type>&([^;]+);<\/name_type>/g)].map((match) => match[1]);
  const kinds: NameClass[] = [];
  if (types.includes("surname")) kinds.push("surname");
  if (types.includes("fem")) kinds.push("female");
  if (types.includes("masc")) kinds.push("male");
  if (types.includes("given")) kinds.push("given");
  if (kinds.length === 0) return [];
  const spellings = text(entry, "keb");
  if (spellings.length === 0) return [];
  const readings = [...entry.matchAll(/<r_ele>([\s\S]*?)<\/r_ele>/g)].map((match) => {
    const block = match[1];
    return { value: text(block, "reb")[0], restrictions: text(block, "re_restr") };
  });
  return readings.flatMap(({ value, restrictions }) => {
    if (!value) return [];
    const validSpellings = restrictions.length > 0 ? spellings.filter((item) => restrictions.includes(item)) : spellings;
    return validSpellings.flatMap((kanji) => kinds.map((kind) => ({
      id: `${upstreamEntryId}:${kind}:${kanji}:${value}`,
      upstreamEntryId,
      kind,
      kanji,
      hiragana: value,
      katakana: kanaToKatakana(value),
      romaji: toHepburn(value),
      candidateStatus: "imported_unreviewed" as const,
      sourceId,
    })));
  });
}

async function main() {
  const input = process.argv[2] ? resolve(process.argv[2]) : cachePath;
  if (!existsSync(input)) throw new Error(`JMnedict input not found: ${input}`);
  await mkdir(resolve("src/data/generated/candidates"), { recursive: true });
  const stream = createReadStream(input);
  const decoded = input.endsWith(".gz") ? stream.pipe(createGunzip()) : stream;
  const lines = createInterface({ input: decoded, crlfDelay: Infinity });
  const candidates: ImportedCandidate[] = [];
  let entry = "";
  let inEntry = false;
  for await (const line of lines) {
    if (line === "<entry>") { inEntry = true; entry = line; continue; }
    if (!inEntry) continue;
    entry += `\n${line}`;
    if (line === "</entry>") { candidates.push(...parseEntry(entry)); inEntry = false; entry = ""; }
  }
  const unique = [...new Map(candidates.map((item) => [item.id, item])).values()]
    .sort((a, b) => a.id.localeCompare(b.id, "en"));
  await writeFile(outputPath, `${JSON.stringify(unique)}\n`);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Record<string, unknown>;
  manifest.lastImportedAt = new Date().toISOString().slice(0, 10);
  manifest.inputFile = basename(input);
  manifest.importedCandidateCount = unique.length;
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Imported ${unique.length} deterministic JMnedict candidates from ${basename(input)}.`);
}

if (process.argv[1]?.endsWith("import-jmnedict.ts")) void main();
