import { Service } from '../service';

describe('Cache Service', () => {
  let service: Service;

  beforeEach(() => {
    service = new Service();
  });

  describe('add', () => {
    it('should add an item to the cache', () => {
      const key = 'testKey';
      const value = 'testValue';
      
      service.add(key, value);
      
      expect(service.get(key)).toBe(value);
    });

    it('should overwrite existing items with the same key', () => {
      const key = 'testKey';
      const value1 = 'testValue1';
      const value2 = 'testValue2';
      
      service.add(key, value1);
      service.add(key, value2);
      
      expect(service.get(key)).toBe(value2);
    });
  });

  describe('get', () => {
    it('should return the value for an existing key', () => {
      const key = 'testKey';
      const value = 'testValue';
      
      service.add(key, value);
      
      expect(service.get(key)).toBe(value);
    });

    it('should return undefined for a non-existing key', () => {
      const key = 'nonExistingKey';
      
      expect(service.get(key)).toBeUndefined();
    });

    it('should return undefined for a key that was removed', () => {
      const key = 'testKey';
      const value = 'testValue';
      
      service.add(key, value);
      service.remove(key);
      
      expect(service.get(key)).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove an existing item from the cache', () => {
      const key = 'testKey';
      const value = 'testValue';
      
      service.add(key, value);
      expect(service.get(key)).toBe(value);
      
      service.remove(key);
      expect(service.get(key)).toBeUndefined();
    });

    it('should not throw an error when removing a non-existing key', () => {
      const key = 'nonExistingKey';
      
      expect(() => service.remove(key)).not.toThrow();
    });
  });

  describe('cache behavior', () => {
    it('should respect the max cache size limit', () => {
      // The cache is configured with max: 10
      // Add 11 items to test eviction
      for (let i = 0; i < 11; i++) {
        service.add(`key${i}`, `value${i}`);
      }
      
      // The first item should be evicted (LRU behavior)
      expect(service.get('key0')).toBeUndefined();
      expect(service.get('key10')).toBe('value10');
    });

    it('should handle multiple operations correctly', () => {
      const operations = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
      ];
      
      // Add all items
      operations.forEach(({ key, value }) => {
        service.add(key, value);
      });
      
      // Verify all items exist
      operations.forEach(({ key, value }) => {
        expect(service.get(key)).toBe(value);
      });
      
      // Remove middle item
      service.remove('key2');
      expect(service.get('key2')).toBeUndefined();
      
      // Verify other items still exist
      expect(service.get('key1')).toBe('value1');
      expect(service.get('key3')).toBe('value3');
    });
  });
});
