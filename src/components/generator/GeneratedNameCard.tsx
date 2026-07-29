import Link from "next/link";
import { LockIcon } from "@/components/icons";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import type { GeneratedName, NameOrder } from "@/types/names";

const naturalnessLabel = {
  high: "High",
  medium: "Medium",
  fiction_friendly: "Fiction-friendly",
  needs_review: "Needs review",
};

export function GeneratedNameCard({
  item,
  order,
  surnameLocked,
  firstNameLocked,
  onLockSurname,
  onLockFirstName,
}: {
  item: GeneratedName;
  order: NameOrder;
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

  return (
    <article className="surface flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="japanese-display text-[2rem] font-medium leading-tight">{japanese}</p>
          <p className="mt-1 font-semibold">{romaji}</p>
          <p className="japanese-display mt-0.5 text-sm text-[#6a746d]">{hiragana}</p>
        </div>
        <FavoriteButton
          compact
          item={{
            id: `full:${item.key}`,
            kind: "full_name",
            label: japanese,
            sublabel: romaji,
          }}
        />
      </div>
      <dl className="mb-5 grid gap-2 border-t border-[#e3e2dc] pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">Naturalness</dt>
          <dd className="font-semibold">{naturalnessLabel[item.naturalness]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">Style</dt>
          <dd className="font-semibold capitalize">{item.firstName.styles[0]}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">Meaning</dt>
          <dd className="max-w-[65%] text-right font-semibold">
            {item.variation.meanings.join(", ")}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#707970]">Surname origin</dt>
          <dd className="font-semibold capitalize">{item.surname.originTypes[0]}</dd>
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
        <Link href={`/surname/${item.surname.slug}`}>Explore surname</Link>
        <Link href={`/name/${item.firstName.slug}`}>Explore first name</Link>
      </div>
    </article>
  );
}
