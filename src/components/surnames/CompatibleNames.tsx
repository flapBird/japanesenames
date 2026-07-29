import Link from "next/link";
import type { FirstNameRecord, SurnameRecord } from "@/types/names";

export function CompatibleNames({
  surname,
  names,
}: {
  surname: SurnameRecord;
  names: FirstNameRecord[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {names.map((name) => {
        const variation = name.variations[0];
        return (
          <Link
            className="surface flex items-center justify-between gap-4 p-4"
            href={`/?surname=${surname.id}&firstName=${name.id}#generator`}
            key={name.id}
          >
            <span>
              <span className="japanese-display block text-xl font-semibold">
                {surname.kanji} {variation.kanji}
              </span>
              <span className="mt-1 block text-sm text-[#647068]">
                {surname.romaji} {name.romaji}
              </span>
            </span>
            <span className="text-sm font-bold text-[#315c4b]">Use →</span>
          </Link>
        );
      })}
    </div>
  );
}
