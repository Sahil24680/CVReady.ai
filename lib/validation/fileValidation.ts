/**
 * File validation utilities for resume uploads
 *
 * Provides centralized file validation logic used across
 * client and server components.
 */

export const MAX_FILE_SIZE_MB = 1;
export const ALLOWED_FILE_TYPES = ['application/pdf'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an uploaded file for resume processing
 *
 * @param file - The file to validate
 * @returns FileValidationResult with valid flag and optional error message
 *
 * @example
 * ```typescript
 * const result = validateUploadFile(file);
 * if (!result.valid) {
 *   toast.error(result.error);
 *   return;
 * }
 * ```
 */
export function validateUploadFile(file: File): FileValidationResult {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are allowed' };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `File size must be less than ${MAX_FILE_SIZE_MB}MB` };
  }

  return { valid: true };
}
