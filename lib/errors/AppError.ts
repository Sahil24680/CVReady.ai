/**
 * Custom application error class
 *
 * Provides structured error handling with status codes
 * and error codes for better error management.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Extracts a user-friendly error message from any error type
 *
 * @param error - The error to extract message from
 * @returns User-friendly error message string
 *
 * @example
 * ```typescript
 * try {
 *   await someAsyncOperation();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

/**
 * Handles API errors and returns a proper NextResponse
 *
 * @param error - The error to handle
 * @returns NextResponse with appropriate status code and error message
 *
 * @example
 * ```typescript
 * try {
 *   // API logic here
 *   return NextResponse.json({ data });
 * } catch (error) {
 *   return handleApiError(error);
 * }
 * ```
 */
export function handleApiError(error: unknown): Response {
  const message = getErrorMessage(error);
  console.error('API Error:', message);

  if (error instanceof AppError) {
    return new Response(JSON.stringify({ error: message }), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
