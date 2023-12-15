type MemoizeCache<T> = {
  has(key: string): boolean;
  get(key: string): T | undefined;
  set(key: string, value: T): void;
};

type MemoizeOptions<T> = {
  cache: {
    create(): MemoizeCache<T>;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoize<T>(fn: (...args: any[]) => T, options: MemoizeOptions<T>): (...args: any[]) => T {
  const { cache } = options;
  const memoCache = cache.create();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]): T => {
    const key = JSON.stringify(args);

    if (memoCache.has(key)) {
      return memoCache.get(key) as T;
    }

    const result = fn(...args);
    memoCache.set(key, result);
    return result;
  };
}
