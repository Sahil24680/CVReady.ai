import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(
  error: any,
  defaultMessage = 'An unknown error occurred'
): string {
  return error instanceof Error ? error.message : defaultMessage
}


