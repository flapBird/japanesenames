# JMnedict source cache

`JMnedict.xml.gz` is downloaded only from EDRDG's official FTP endpoint into
`.data-cache/jmnedict/`, which is intentionally gitignored. `npm run
data:import:jmnedict` accepts either that cache file or an explicit local XML/
XML.gz path. The importer preserves EDRDG entry IDs and only produces
`imported_unreviewed` candidates; it never makes them public production data.

JMnedict/ENAMDICT is used under CC BY-SA 4.0. EDRDG is acknowledged as the
source and is not represented as endorsing this site.
