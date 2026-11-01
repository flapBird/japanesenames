"use client";

import { useSyncExternalStore } from "react";
import { HeartIcon } from "@/components/icons";
import {
  isFavorite,
  subscribeFavorites,
  toggleFavorite,
  type FavoriteItem,
} from "@/lib/favorites";
import { trackEvent, type EventName } from "@/lib/analytics";

export function FavoriteButton({
  item,
  eventName = "favorite_full_name",
  compact = false,
}: {
  item: Omit<FavoriteItem, "savedAt">;
  eventName?: EventName;
  compact?: boolean;
}) {
  const active = useSyncExternalStore(
    subscribeFavorites,
    () => isFavorite(item.id),
    () => false,
  );

  return (
    <button
      aria-label={`${active ? "Remove from" : "Add to"} favorites: ${item.label}`}
      aria-pressed={active}
      className={`button-quiet !min-h-9 ${active ? "!text-(--clay)" : ""} ${
        compact
          ? `!size-10 !min-h-10 !shrink-0 !p-0 !border ${
              active
                ? "!border-[#d8afa6] !bg-(--clay-soft)"
                : "!border-(--line) !bg-(--surface) hover:!border-(--clay)"
            }`
          : ""
      }`}
      onClick={() => {
        const saved = toggleFavorite(item);
        if (saved) trackEvent(eventName, { id: item.id, kind: item.kind });
      }}
      title={active ? "Remove from favorites" : "Add to favorites"}
      type="button"
    >
      <HeartIcon
        className={active ? "text-(--clay)" : "text-(--muted)"}
        filled={active}
      />
      {compact ? null : active ? "Saved" : "Favorite"}
    </button>
  );
}
