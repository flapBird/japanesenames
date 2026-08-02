# Japanese Names

## Data updates

The production name dataset is a deliberately reviewed subset of JMnedict; it
does not call an external API at runtime. Download the official XML.gz to
`.data-cache/jmnedict/JMnedict.xml.gz`, then run:

```sh
npm run data:import:jmnedict
npm run data:import:kanjidic2
npm run data:curate
npm run data:report
npm run validate:data
```

See [THIRD_PARTY_DATA.md](./THIRD_PARTY_DATA.md) and
[DATA_LICENSES.md](./DATA_LICENSES.md) for attribution and licence terms.

Japanese Names is an English-language reference and name-generation website for exploring Japanese given names, full names, and surnames with cultural context.

Website: [japanesenames.site](https://japanesenames.site)

## Main Features

- Generate Japanese full names from a structured local name database.
- Filter names by gender, style, name mode, and meaning.
- Include a specific kanji in the given name, surname, or either part of the full name.
- Choose common kanji through English meaning shortcuts such as Moon, Love, Light, and Beauty.
- Lock a surname or given name while generating new combinations.
- View kanji, hiragana, romaji, meanings, gender, style, and rule-based naturalness labels.
- Listen to name pronunciation using the browser's built-in speech synthesis.
- Copy and save full names, given names, and surnames locally in the browser.
- Browse Japanese girl names, boy names, last names, and detailed name pages.
- Explore surname kanji breakdowns, origin illustrations, regional information, timelines, confidence labels, and cited sources.
- Clearly distinguish verified, partially verified, uncertain, and review-needed data.

The generator only selects recorded names and kanji variations from the project data. It does not create new kanji combinations, invent readings, or use a language model at runtime.

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run validate:data
npm run lint
npm run typecheck
npm test
npm run build
```

The application uses Next.js, TypeScript, Tailwind CSS, static generation, and local structured data.
