import type { LatestRatesPayload } from "./types";

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const globalObject = globalThis as typeof globalThis & {
  __currencyRatesCache?: Map<string, CacheEntry>;
};

type CacheEntry = {
  expiresAt: number;
  payload: LatestRatesPayload;
};

const cacheStore: Map<string, CacheEntry> =
  globalObject.__currencyRatesCache ?? new Map();

if (!globalObject.__currencyRatesCache) {
  globalObject.__currencyRatesCache = cacheStore;
}

function resolveTtl(): number {
  const value = Number(process.env.FIXER_CACHE_TTL_MS ?? DEFAULT_CACHE_TTL_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_CACHE_TTL_MS;
}

export function getCachedLatestRates(key: string): LatestRatesPayload | null {
  const entry = cacheStore.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt <= Date.now()) {
    cacheStore.delete(key);
    return null;
  }
  return entry.payload;
}

export function setCachedLatestRates(
  key: string,
  payload: LatestRatesPayload
): void {
  cacheStore.set(key, {
    payload,
    expiresAt: Date.now() + resolveTtl(),
  });
}

export function clearCachedLatestRates(key?: string): void {
  if (key) {
    cacheStore.delete(key);
    return;
  }
  cacheStore.clear();
}
