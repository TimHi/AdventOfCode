export type Dictionary<Key extends keyof never, Value> = {
  [key in Key]: Value; // Mapped types syntax
};
