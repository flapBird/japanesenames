# Japanese Names

An English-language reference and name-generation website for exploring Japanese given names, surnames, and full names with kanji, readings, meanings, and cultural context.

**Live site:** [japanesenames.site](https://japanesenames.site)

## Features

- Generate Japanese full names from a structured local dataset.
- Filter by gender, style, name mode, meaning, kanji length, and surname popularity.
- Require a specific kanji in the given name, surname, or either part of the full name.
- Use English meaning shortcuts such as Moon, Love, Light, and Beauty.
- Lock a surname or given name while generating new combinations.
- View kanji, hiragana, romaji, dictionary glosses, gender, style, and naturalness labels.
- Browse dedicated collections for girl names, boy names, surnames, and last names.
- Explore detail pages with kanji breakdowns, regional context, timelines, confidence labels, and cited sources.
- Listen to pronunciations through the browser's speech-synthesis API.
- Copy names and save favorites locally in the browser.
- Describe a preferred name in natural language with the optional AI-assisted generator.
- Expose SEO metadata, structured data, a sitemap, robots rules, and a web app manifest.

## How name generation works

The standard generator selects recorded names and kanji variations from the project's local dataset. It does not call an external API, invent readings, or create new kanji combinations at runtime.

The AI-assisted generator also remains database-backed. A language model may parse a natural-language request into a strict, allowlisted intent schema, but local code handles name retrieval, ranking, full-name pairing, and explanations. If no provider is configured—or the provider is unavailable—the feature automatically falls back to local keyword matching.

Imported records retain their upstream JMnedict entry IDs. Data-quality fields distinguish reviewed, partially verified, uncertain, and review-needed content; KANJIDIC2 glosses describe individual characters and are not presented as proof of a complete name's meaning or naming intention.

## Tech stack

- [Next.js 15](https://nextjs.org/) with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Vitest for unit and data-quality tests
- Local, statically importable name data derived from curated and editorial sources

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The environment file is optional for the core site; without an AI provider, the AI-assisted page uses its local parser.

For a production build:

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and set only the values you need. Never commit `.env.local` or an API key.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | — | Valid Google Analytics 4 measurement ID, such as `G-XXXXXXXXXX`. |
| `AI_API_KEY` | No | — | Server-only API key for the optional intent parser. |
| `AI_MODEL` | With `AI_API_KEY` | — | Model name used by the configured provider. |
| `AI_BASE_URL` | No | `https://api.openai.com/v1` | Base URL for an OpenAI-compatible provider. |
| `AI_API_STYLE` | No | `responses` | API shape: `responses` or `chat_completions`. |
| `AI_RESPONSE_FORMAT` | No | `json_schema` | Structured response mode: `json_schema` or `json_object`. |
| `AI_MAX_OUTPUT_TOKENS` | No | `400` (`1200` for `json_object`) | Output budget, clamped to 200–2,000 tokens. |
| `AI_TIMEOUT_MS` | No | `8000` | Provider timeout, clamped to 2,000–15,000 ms. |
| `AI_NAME_GENERATOR_ENABLED` | No | `true` | Set to `false` to disable the AI-assisted API route. |

Providers that support Chat Completions but not strict Structured Outputs can use:

```dotenv
AI_API_STYLE=chat_completions
AI_RESPONSE_FORMAT=json_object
```

Every provider response is still parsed and validated against the same allowlisted schema before it is used. API secrets are read only by the server-side route.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint across the project. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm test` | Run the Vitest suite once. |
| `npm run validate:data` | Validate source references and production name records. |
| `npm run data:import:jmnedict` | Import deterministic, unreviewed candidates from JMnedict. |
| `npm run data:import:kanjidic2` | Import English character glosses from KANJIDIC2. |
| `npm run data:curate` | Build the curated TypeScript dataset from imported candidates. |
| `npm run data:report` | Print coverage, evidence, filter, and diversity metrics. |

## Quality checks

Run the complete local verification set before submitting changes:

```bash
npm run validate:data
npm run lint
npm run typecheck
npm test
npm run build
```

## Updating the name data

Production does not fetch JMnedict or KANJIDIC2 at runtime. Raw source archives and intermediate candidate JSON files are intentionally excluded from Git.

1. Download the official archives:

   - JMnedict: <https://ftp.edrdg.org/pub/Nihongo/JMnedict.xml.gz>
   - KANJIDIC2: <https://ftp.edrdg.org/pub/Nihongo/kanjidic2.xml.gz>

2. Place them at:

   ```text
   .data-cache/jmnedict/JMnedict.xml.gz
   .data-cache/kanjidic2.xml.gz
   ```

3. Run the deterministic import, curation, reporting, and validation pipeline:

   ```bash
   npm run data:import:jmnedict
   npm run data:import:kanjidic2
   npm run data:curate
   npm run data:report
   npm run validate:data
   ```

The JMnedict importer also accepts an explicit local `.xml` or `.xml.gz` path:

```bash
npm run data:import:jmnedict -- /path/to/JMnedict.xml.gz
```

Editorial records in `src/data/first-names.ts` and `src/data/surnames.ts` take precedence over matching generated records. Review generated changes and the coverage report before committing an updated production dataset.

## Project structure

```text
src/
├── app/                         # App Router pages, metadata, and API routes
├── components/                  # Generators, explorers, shared UI, and analytics
├── data/                        # Editorial, generated, and source-reference data
├── lib/                         # Name logic, AI parsing, SEO, validation, and tests
└── types/                       # Shared domain types
scripts/                         # Data import, curation, reporting, and validation
data-sources/                    # Source manifests and dataset-specific notes
public/                          # Icons, ads.txt, llms.txt, and other static assets
```

## Data sources and licensing

Selected name records and classifications are derived from **JMnedict/ENAMDICT**, and character-level English glosses are derived from **KANJIDIC2**. Both datasets are published by the Electronic Dictionary Research and Development Group (EDRDG) and used under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). EDRDG does not endorse this project.

See [THIRD_PARTY_DATA.md](./THIRD_PARTY_DATA.md), [DATA_LICENSES.md](./DATA_LICENSES.md), and the notes in [`data-sources/`](./data-sources/) for source details, attribution, and license terms. The data license does not relicense the application source code.
