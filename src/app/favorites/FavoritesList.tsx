"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import {
  favoriteSnapshot,
  subscribeFavorites,
  type FavoriteItem,
} from "@/lib/favorites";

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

  if (items.length === 0) {
    return (
      <div className="surface py-14 text-center">
        <span className="seal mx-auto" aria-hidden="true">空</span>
        <h2 className="mt-5 text-xl font-semibold">No favorites yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647068]">
          Save a full name, first name, or surname. Favorites stay in this
          browser and do not require an account.
        </p>
        <Link className="button-primary mt-5" href="/#generator">Open generator</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <article className="surface flex items-center justify-between gap-4 p-5" key={item.id}>
          <div>
            {item.href ? (
              <Link className="text-lg font-semibold" href={item.href}>{item.label}</Link>
            ) : (
              <p className="text-lg font-semibold">{item.label}</p>
            )}
            <p className="mt-1 text-sm text-[#647068]">{item.sublabel}</p>
            <span className="chip mt-3 capitalize">{item.kind.replace("_", " ")}</span>
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
        </article>
      ))}
    </div>
  );
}
