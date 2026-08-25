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
- Describe a preferred name in natural language and match it against the same
  structured database through the isolated AI-assisted generator.
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

The standard generator only selects recorded names and kanji variations from
the project data. It does not create new kanji combinations, invent readings,
or use a language model at runtime.

The optional AI-assisted page uses a language model only to parse intent. Name
retrieval, ranking, full-name pairing, and explanations remain local and
database-backed. When no provider is configured, a local keyword parser keeps
the page functional. Copy `.env.example` to `.env.local` and set `AI_API_KEY`,
`AI_MODEL`, and optionally `AI_BASE_URL` / `AI_API_STYLE` to enable the remote
parser. Secrets are read only by the server-side API route.

Providers that implement Chat Completions but not strict Structured Outputs can
use `AI_API_STYLE=chat_completions` with `AI_RESPONSE_FORMAT=json_object`. The
server still validates every returned field against the same allowlisted intent
schema before using it. `AI_MAX_OUTPUT_TOKENS` can be raised for reasoning-style
compatible models that spend part of their output budget before returning JSON.

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
