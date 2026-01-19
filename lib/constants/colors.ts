/**
 * Color constants used throughout the application
 *
 * Centralizes all color values to ensure consistency
 * and make theme changes easier.
 */

export const COLORS = {
  /** Primary blue color - used for CTAs and important elements */
  primaryBlue: '#4382da',

  /** Light blue background - used for hover states and backgrounds */
  lightBlue: '#f5f9fd',

  /** Medium blue - used for secondary text and icons */
  mediumBlue: '#8ea6c4',

  /** Dark blue - used for headers and primary UI elements */
  darkBlue: '#06367a',

  /** Very light blue - used for page backgrounds */
  backgroundLight: '#ebf2fc',

  /** Hover state for light blue backgrounds */
  lightBlueHover: '#e8f1fb',
} as const;

/**
 * Type for accessing color keys
 */
export type ColorKey = keyof typeof COLORS;
