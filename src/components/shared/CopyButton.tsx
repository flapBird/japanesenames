"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/icons";
import { trackEvent, type EventName } from "@/lib/analytics";

export function CopyButton({
  text,
  eventName = "copy_full_name",
  label = "Copy",
  className = "",
  compact = false,
}: {
  text: string;
  eventName?: EventName;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackEvent(eventName, { text });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      aria-label={`${label}: ${text}`}
      className={`button-quiet !min-h-9 ${
        compact
          ? `!size-10 !min-h-10 !shrink-0 !border !p-0 ${
              copied
                ? "!border-[#9eb8a8] !bg-[#e7eee9] !text-[#315c4b]"
                : "!border-[#deddd5] !bg-[#fffefb] !text-[#647068] hover:!border-[#315c4b]"
            }`
          : "!px-2.5"
      } ${className}`}
      onClick={copy}
      title={copied ? "Copied" : label}
      type="button"
    >
      <CopyIcon />
      {compact ? (
        <span aria-live="polite" className="sr-only">{copied ? "Copied" : ""}</span>
      ) : copied ? "Copied" : label}
    </button>
  );
}
