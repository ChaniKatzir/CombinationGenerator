import { describe, expect, it } from 'vitest';

import { ValidationUtils } from './validation.utils';

describe('ValidationUtils', () => {
  describe('validatePageNumber', () => {
    it.each([
      [null],
      [undefined],
      [''],
      ['0'],
      ['-1'],
      ['1.5'],
      ['abc'],
      ['  '],
    ])('should reject invalid page number: %s', (value) => {
      const result = ValidationUtils.validatePageNumber(value);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please enter a valid page number.');
    });

    it.each([
      ['1'],
      ['24'],
      [1],
      [24n],
    ])('should accept valid page number: %s', (value) => {
      const result = ValidationUtils.validatePageNumber(value);

      expect(result.isValid).toBe(true);
      expect(result.message).toBeNull();
    });

    it('should reject page number greater than total pages', () => {
      const result = ValidationUtils.validatePageNumber('25', '24');

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Page number must be between 1 and 24.');
    });

    it('should accept page number equal to total pages', () => {
      const result = ValidationUtils.validatePageNumber('24', '24');

      expect(result.isValid).toBe(true);
      expect(result.message).toBeNull();
    });
  });

  describe('validateN', () => {
    it.each([0, 21, 1.5])('should reject invalid n: %s', (value) => {
      const result = ValidationUtils.validateN(value, 1, 20);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please enter a number between 1 and 20.');
    });

    it.each([1, 20])('should accept valid n: %s', (value) => {
      const result = ValidationUtils.validateN(value, 1, 20);

      expect(result.isValid).toBe(true);
      expect(result.message).toBeNull();
    });
  });

  describe('validatePageSize', () => {
    it.each([0, -1, 1.5])('should reject invalid page size: %s', (value) => {
      const result = ValidationUtils.validatePageSize(value);

      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Invalid page size.');
    });

    it.each([1, 5, 10, 50])('should accept valid page size: %s', (value) => {
      const result = ValidationUtils.validatePageSize(value);

      expect(result.isValid).toBe(true);
      expect(result.message).toBeNull();
    });
  });

  describe('normalizePageNumber', () => {
    it('should return normalized page number', () => {
      expect(ValidationUtils.normalizePageNumber(' 12 ')).toBe('12');
    });

    it('should return null for invalid page number', () => {
      expect(ValidationUtils.normalizePageNumber('0')).toBeNull();
      expect(ValidationUtils.normalizePageNumber('abc')).toBeNull();
    });
  });
});