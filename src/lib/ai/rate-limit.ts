interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const windowMs = 10 * 60 * 1000;
const maxRequests = 10;

declare global {
  var japaneseNamesAIRateLimits: Map<string, RateLimitEntry> | undefined;
}

function store() {
  globalThis.japaneseNamesAIRateLimits ??= new Map<string, RateLimitEntry>();
  return globalThis.japaneseNamesAIRateLimits;
}

export function checkAIRateLimit(key: string, now = Date.now()) {
  const entries = store();
  if (entries.size > 1_000) {
    for (const [entryKey, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(entryKey);
    }
  }
  const current = entries.get(key);
  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfter: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    retryAfter: 0,
  };
}

export function resetAIRateLimitsForTests() {
  store().clear();
}
