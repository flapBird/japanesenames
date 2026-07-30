export function HighlightedKanji({
  kanji,
  value,
}: {
  kanji?: string;
  value: string;
}) {
  if (!kanji || !value.includes(kanji)) return value;

  const parts = value.split(kanji);
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 && (
            <mark className="rounded bg-[#f1dfe3] px-0.5 text-inherit">
              {kanji}
            </mark>
          )}
        </span>
      ))}
    </>
  );
}
