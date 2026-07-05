import { ValidationResult } from '../models/validation-result.model';

export class ValidationUtils {
  private static readonly positiveIntegerPattern = /^[1-9]\d*$/;

  static success(): ValidationResult {
    return {
      isValid: true,
      message: null,
    };
  }

  static failure(message: string): ValidationResult {
    return {
      isValid: false,
      message,
    };
  }

  static isPositiveInteger(value: string | number | bigint): boolean {
    return this.positiveIntegerPattern.test(String(value).trim());
  }

  static validateN(value: number, min: number, max: number): ValidationResult {
    if (!Number.isInteger(value) || value < min || value > max) {
      return this.failure(`Please enter a number between ${min} and ${max}.`);
    }

    return this.success();
  }

  static validatePageNumber(
    pageNumber: string | number | bigint | null | undefined,
    totalPages?: string | null,
  ): ValidationResult {
    const normalizedPageNumber = String(pageNumber ?? '').trim();

    if (!this.isPositiveInteger(normalizedPageNumber)) {
      return this.failure('Please enter a valid page number.');
    }

    if (
      totalPages &&
      this.isPositiveInteger(totalPages) &&
      BigInt(normalizedPageNumber) > BigInt(totalPages)
    ) {
      return this.failure(`Page number must be between 1 and ${totalPages}.`);
    }

    return this.success();
  }

  static validatePageSize(pageSize: number): ValidationResult {
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      return this.failure('Invalid page size.');
    }

    return this.success();
  }

  static normalizePageNumber(
    pageNumber: string | number | bigint,
  ): string | null {
    const value = String(pageNumber).trim();

    if (!this.isPositiveInteger(value)) {
      return null;
    }

    return value;
  }
}