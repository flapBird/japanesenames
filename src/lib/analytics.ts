export type EventName =
  | "generate_names"
  | "regenerate_names"
  | "lock_surname"
  | "lock_first_name"
  | "copy_full_name"
  | "favorite_full_name"
  | "open_surname"
  | "open_first_name"
  | "filter_generator"
  | "search_first_names"
  | "search_surnames"
  | "play_pronunciation"
  | "use_name_in_generator";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: EventName,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  const event = { name, properties, timestamp: Date.now() };
  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event);
  }
  window.gtag?.("event", name, properties);
  window.dispatchEvent(new CustomEvent("japanese-names:analytics", { detail: event }));
}
