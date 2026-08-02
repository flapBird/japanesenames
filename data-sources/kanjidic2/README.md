# KANJIDIC2 source cache

`kanjidic2.xml.gz` is downloaded from EDRDG's official endpoint into
`.data-cache/`, then `npm run data:import:kanjidic2` extracts only English
literal kanji meanings into a gitignored candidate artifact. The meanings are
used as literal character descriptions, never as a claim of parental intent.

KANJIDIC2 is attributed to EDRDG and used under CC BY-SA 4.0.
