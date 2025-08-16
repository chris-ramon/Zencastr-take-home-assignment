import { LRUCache } from "lru-cache";

// Service represents the cache service.
export class Service {
  cache: LRUCache<string, string>;

  constructor() {
    const options = {
      max: 10,

      // for use with tracking overall storage size.
      maxSize: 5000,
      sizeCalculation: (value: string, key: string) => {
        return 1;
      },

      // how long to live in ms.
      ttl: 1000 * 60 * 5,
    };
    this.cache = new LRUCache(options);
  }

  // add adds an item to the cache service.
  add(key: string, value: string) {
    this.cache.set(key, value);
  }

  // remove removes an item from the cache service.
  remove(key: string) {
    this.cache.delete(key);
  }

  // get gets an item from the cache service.
  get(key: string) {
    return this.cache.get(key);
  }
}
