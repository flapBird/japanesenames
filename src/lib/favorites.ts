export type FavoriteKind = "full_name" | "first_name" | "surname";

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  label: string;
  sublabel: string;
  href?: string;
  savedAt: string;
}

const STORAGE_KEY = "japanese-names:favorites:v1";
const CHANGE_EVENT = "japanese-names:favorites-change";

export function favoriteSnapshot() {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function readFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string) {
  return readFavorites().some((item) => item.id === id);
}

export function toggleFavorite(item: Omit<FavoriteItem, "savedAt">) {
  if (typeof window === "undefined") return false;
  try {
    const items = readFavorites();
    const exists = items.some((favorite) => favorite.id === item.id);
    const next = exists
      ? items.filter((favorite) => favorite.id !== item.id)
      : [{ ...item, savedAt: new Date().toISOString() }, ...items];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return !exists;
  } catch {
    return false;
  }
}

export function subscribeFavorites(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
