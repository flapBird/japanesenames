import Link from "next/link";
import { LockIcon } from "@/components/icons";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { HighlightedKanji } from "@/components/shared/HighlightedKanji";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import type { GeneratedName, NameOrder } from "@/types/names";

const naturalnessLabel = {
  high: "High",
  medium: "Medium",
  fiction_friendly: "Fiction-friendly",
  needs_review: "Needs review",
};

const naturalnessTone = {
  high: "bg-[#e6efe9] text-[#315c4b]",
  medium: "bg-[#f7eddc] text-[#795a24]",
  fiction_friendly: "bg-[#f7e8eb] text-[#9f4f60]",
  needs_review: "bg-[#efeeea] text-[#68726b]",
};

export function GeneratedNameCard({
  item,
  order,
  highlightKanji,
  surnameLocked,
  firstNameLocked,
  onLockSurname,
  onLockFirstName,
}: {
  item: GeneratedName;
  order: NameOrder;
  highlightKanji?: string;
  surnameLocked: boolean;
  firstNameLocked: boolean;
  onLockSurname: () => void;
  onLockFirstName: () => void;
}) {
  const japanese =
    order === "japanese"
      ? `${item.surname.kanji} ${item.variation.kanji}`
      : `${item.variation.kanji} ${item.surname.kanji}`;
  const romaji =
    order === "japanese"
      ? `${item.surname.romaji} ${item.firstName.romaji}`
      : `${item.firstName.romaji} ${item.surname.romaji}`;
  const hiragana =
    order === "japanese"
      ? `${item.surname.hiragana} ${item.firstName.hiragana}`
      : `${item.firstName.hiragana} ${item.surname.hiragana}`;
  const dictionaryListed = Boolean(item.firstName.candidateStatus);

  return (
    <article className="surface name-result-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="japanese-display text-[2rem] font-medium leading-tight">
            <HighlightedKanji kanji={highlightKanji} value={japanese} />
          </p>
          <p className="mt-1 font-semibold">{romaji}</p>
          <p className="japanese-display mt-0.5 text-sm text-[#6a746d]">{hiragana}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <PronunciationButton label={romaji} text={hiragana} />
          <FavoriteButton
            compact
            item={{
              id: `full:${item.key}`,
              kind: "full_name",
              label: japanese,
              sublabel: romaji,
              pronunciation: hiragana,
            }}
          />
        </div>
      </div>
      <dl className="mb-5 grid gap-2 border-t border-[#e3e2dc] pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">{dictionaryListed ? "Evidence" : "Naturalness"}</dt>
          <dd
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${naturalnessTone[item.naturalness]}`}
          >
            {dictionaryListed ? "Dictionary-listed" : naturalnessLabel[item.naturalness]}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">Gender</dt>
          <dd className="font-semibold capitalize">
            {item.firstName.genders.join(" / ")}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">Meaning</dt>
          <dd className="max-w-[65%] text-right font-semibold">
            {item.variation.meanings.join(", ")}
          </dd>
        </div>
      </dl>
      <div className="mt-auto grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-1 border-t border-[#e3e2dc] pt-3">
        <button
          aria-label={`Lock surname ${item.surname.romaji} and generate different first names`}
          aria-pressed={surnameLocked}
          className={`button-quiet !min-h-9 min-w-0 justify-center !px-1.5 !text-[0.68rem] whitespace-nowrap sm:!px-2 sm:!text-xs [&_svg]:hidden sm:[&_svg]:block ${
            surnameLocked ? "!bg-[#e7eee9] !text-[#315c4b]" : ""
          }`}
          disabled={surnameLocked}
          onClick={onLockSurname}
          title={`Lock ${item.surname.romaji} and generate different first names`}
          type="button"
        >
          <LockIcon />
          {surnameLocked ? "Surname locked" : "Lock surname"}
        </button>
        <button
          aria-label={`Lock first name ${item.firstName.romaji} and generate different surnames`}
          aria-pressed={firstNameLocked}
          className={`button-quiet !min-h-9 min-w-0 justify-center !px-1.5 !text-[0.68rem] whitespace-nowrap sm:!px-2 sm:!text-xs [&_svg]:hidden sm:[&_svg]:block ${
            firstNameLocked ? "!bg-[#e7eee9] !text-[#315c4b]" : ""
          }`}
          disabled={firstNameLocked}
          onClick={onLockFirstName}
          title={`Lock ${item.firstName.romaji} and generate different surnames`}
          type="button"
        >
          <LockIcon />
          {firstNameLocked ? "First name locked" : "Lock first name"}
        </button>
        <CopyButton
          className="justify-center !px-1.5 !text-[0.68rem] sm:!px-2 sm:!text-xs [&_svg]:hidden sm:[&_svg]:block"
          text={`${japanese} — ${romaji} — ${hiragana}`}
        />
      </div>
      <div className="mt-3 flex gap-4 text-xs font-bold text-[#315c4b]">
        {item.surname.isIndexable && <Link href={`/surname/${item.surname.slug}`}>Explore surname</Link>}
        {item.firstName.isIndexable && <Link href={`/name/${item.firstName.slug}`}>Explore first name</Link>}
      </div>
    </article>
  );
}
