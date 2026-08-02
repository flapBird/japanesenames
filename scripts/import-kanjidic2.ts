import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";

const inputPath = resolve(".data-cache/kanjidic2.xml.gz");
const outputPath = resolve("src/data/generated/candidates/kanjidic2-meanings.json");

function values(block: string, tag: string) {
  return [...block.matchAll(new RegExp(`<${tag}(?: [^>]*)?>([\\s\\S]*?)</${tag}>`, "g"))]
    .map((match) => match[1].trim().normalize("NFC"));
}

async function main() {
  if (!existsSync(inputPath)) throw new Error(`KANJIDIC2 input not found: ${inputPath}`);
  const xml = gunzipSync(await readFile(inputPath)).toString("utf8");
  const entries = [...xml.matchAll(/<character>([\s\S]*?)<\/character>/g)].flatMap((match) => {
    const block = match[1];
    const literal = values(block, "literal")[0];
    const meanings = [...block.matchAll(/<meaning(?: m_lang="eng")?>([\s\S]*?)<\/meaning>/g)]
      .filter((meaning) => !meaning[0].includes("m_lang=") || meaning[0].includes('m_lang="eng"'))
      .map((meaning) => meaning[1].trim());
    return literal && meanings.length > 0 ? [[literal, [...new Set(meanings)]] as const] : [];
  });
  await mkdir(resolve("src/data/generated/candidates"), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`);
  console.log(`Imported ${entries.length} KANJIDIC2 English literal-meaning records.`);
}

if (process.argv[1]?.endsWith("import-kanjidic2.ts")) void main();
