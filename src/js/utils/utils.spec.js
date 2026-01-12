import { describe, it, expect, vi } from 'vitest';
import { trace } from './utils';

describe('Utils', () => {
  describe('trace', () => {
    it('should log the value to console', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const testValue = 'test value';

      trace(testValue);

      expect(consoleSpy).toHaveBeenCalledWith(testValue);
      consoleSpy.mockRestore();
    });

    it('should return the value unchanged', () => {
      const testValue = { a: 1, b: 2 };
      const result = trace(testValue);

      expect(result).toBe(testValue);
    });

    it('should work with different data types', () => {
      const testCases = [
        'string',
        42,
        true,
        null,
        undefined,
        { key: 'value' },
        [1, 2, 3]
      ];

      testCases.forEach(value => {
        const result = trace(value);
        expect(result).toBe(value);
      });
    });
  });
});
