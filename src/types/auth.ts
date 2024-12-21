export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: Date;
}
