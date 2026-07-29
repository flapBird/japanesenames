"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import {
  favoriteSnapshot,
  subscribeFavorites,
  type FavoriteItem,
  type FavoriteKind,
} from "@/lib/favorites";

const groupConfig: Array<{
  kind: FavoriteKind;
  title: string;
  description: string;
}> = [
  {
    kind: "full_name",
    title: "Full names",
    description: "Complete surname and first-name combinations.",
  },
  {
    kind: "first_name",
    title: "First names",
    description: "Readings and kanji spellings you want to revisit.",
  },
  {
    kind: "surname",
    title: "Surnames",
    description: "Family names and origin stories saved for later.",
  },
];

const kindLabel: Record<FavoriteKind, string> = {
  full_name: "Full name",
  first_name: "First name",
  surname: "Surname",
};

function displayParts(item: FavoriteItem) {
  const [japanese, romajiFromLabel] = item.label.split(" · ");
  return {
    japanese,
    romaji: romajiFromLabel ?? item.sublabel,
    detail: romajiFromLabel ? item.sublabel : "Generated full name",
  };
}

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved in this browser";
  return `Saved ${new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)}`;
}

export function FavoritesList() {
  const snapshot = useSyncExternalStore(
    subscribeFavorites,
    favoriteSnapshot,
    () => "[]",
  );
  const items = useMemo(() => {
    try {
      return JSON.parse(snapshot) as FavoriteItem[];
    } catch {
      return [];
    }
  }, [snapshot]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        groupConfig.map(({ kind }) => [
          kind,
          items.filter((item) => item.kind === kind).length,
        ]),
      ) as Record<FavoriteKind, number>,
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="surface overflow-hidden text-center">
        <div className="grid min-h-64 place-items-center bg-[#eef2ee] px-6 py-12">
          <div>
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-[#cbd5ce] bg-[#fffefb] text-2xl text-[#a34837]">
              ♡
            </div>
            <h2 className="mt-5 text-xl font-semibold">No favorites yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647068]">
              Use the heart beside any generated name, first name, or surname.
              Your collection stays in this browser.
            </p>
            <Link className="button-primary mt-5" href="/#generator">
              Find a name
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {groupConfig.map((group) => (
          <div className="surface px-3 py-4 sm:px-5" key={group.kind}>
            <p className="text-2xl font-semibold text-[#315c4b]">
              {counts[group.kind]}
            </p>
            <p className="mt-1 text-xs font-bold text-[#647068] sm:text-sm">
              {group.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10">
        {groupConfig.map((group) => {
          const groupItems = items.filter((item) => item.kind === group.kind);
          if (groupItems.length === 0) return null;
          return (
            <section aria-labelledby={`favorites-${group.kind}`} key={group.kind}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="section-title !text-2xl" id={`favorites-${group.kind}`}>
                    {group.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#647068]">{group.description}</p>
                </div>
                <span className="text-sm font-semibold text-[#647068]">
                  {groupItems.length}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {groupItems.map((item) => {
                  const display = displayParts(item);
                  return (
                    <article
                      className="surface relative flex min-h-64 flex-col overflow-hidden p-5 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-[#a34837]"
                      key={item.id}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="chip capitalize">{kindLabel[item.kind]}</span>
                          <p className="japanese-display mt-5 text-3xl font-medium leading-tight">
                            {display.japanese}
                          </p>
                          <p className="mt-1 font-semibold">{display.romaji}</p>
                          <p className="mt-1 text-sm text-[#647068]">{display.detail}</p>
                        </div>
                        <FavoriteButton
                          compact
                          item={{
                            id: item.id,
                            kind: item.kind,
                            label: item.label,
                            sublabel: item.sublabel,
                            href: item.href,
                          }}
                        />
                      </div>

                      <p className="mt-5 text-xs text-[#7a827d]">
                        {formatSavedAt(item.savedAt)}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-[#e3e2dc] pt-4">
                        <CopyButton
                          label="Copy"
                          text={`${item.label} · ${item.sublabel}`}
                        />
                        <Link
                          className="button-quiet !min-h-9 !px-2.5 !text-[#315c4b]"
                          href={item.href ?? "/#generator"}
                        >
                          {item.href ? "View details →" : "Open generator →"}
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
