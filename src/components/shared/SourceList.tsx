import type { SourceReference } from "@/types/names";

export function SourceList({ sources }: { sources: SourceReference[] }) {
  return (
    <ol className="grid gap-3">
      {sources.map((source) => (
        <li className="surface p-4" key={source.id}>
          <a
            className="font-semibold text-[#315c4b] underline decoration-[#a9b9af] underline-offset-4"
            href={source.url}
            rel="noreferrer"
            target="_blank"
          >
            {source.title}
          </a>
          <p className="mt-1 text-xs text-[#647068]">
            {[source.publisher, source.datasetVersion, source.evidenceType && `Evidence: ${source.evidenceType.replaceAll("_", " ")}`, source.license, source.publishedAt && `Published ${source.publishedAt}`, source.accessedAt && `Accessed ${source.accessedAt}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </li>
      ))}
    </ol>
  );
}
