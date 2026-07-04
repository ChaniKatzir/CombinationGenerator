import { describe, expect, it } from 'vitest';
import { formatLargeNumber } from './format-large-number';

describe('formatLargeNumber', () => {
  it.each([
    ['0', '0'],
    ['1', '1'],
    ['999', '999'],
    ['1000', '1,000'],
    ['2432902008176640000', '2,432,902,008,176,640,000'],
  ])('should format %s as %s', (input, expected) => {
    expect(formatLargeNumber(input)).toBe(expected);
  });

  it('should return empty string for null or undefined', () => {
    expect(formatLargeNumber(null)).toBe('');
    expect(formatLargeNumber(undefined)).toBe('');
  });
});