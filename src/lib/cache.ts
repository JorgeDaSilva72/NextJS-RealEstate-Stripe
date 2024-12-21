import { CacheEntry } from "@/types/auth";

const cache = new Map<string, CacheEntry<any>>();

export const cacheWithTTL = <T>(
  key: string,
  value: T,
  ttl: number = 60000
): void => {
  cache.set(key, {
    value,
    timestamp: Date.now(),
    ttl,
  });
};

export const getCachedValue = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.value as T;
};
