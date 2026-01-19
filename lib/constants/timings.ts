/**
 * Timing constants used throughout the application
 *
 * Centralizes all timing/duration values for animations,
 * timeouts, and other time-based operations.
 */

export const ANIMATION_TIMINGS = {
  /** Caret blink interval in milliseconds */
  caretBlink: 530,

  /** Marquee animation duration in seconds */
  marqueeDuration: 60,

  /** Base typing speed in milliseconds */
  typingSpeedBase: 50,

  /** Random typing speed variation in milliseconds */
  typingSpeedVariation: 100,

  /** Delay between typing and next action */
  typingDelay: 30,
} as const;

export const API_TIMEOUTS = {
  /** Supabase health check timeout in milliseconds */
  supabaseHealthCheck: 8000,

  /** General upload timeout in milliseconds */
  uploadTimeout: 30000,
} as const;

/**
 * Type for accessing animation timing keys
 */
export type AnimationTimingKey = keyof typeof ANIMATION_TIMINGS;

/**
 * Type for accessing API timeout keys
 */
export type APITimeoutKey = keyof typeof API_TIMEOUTS;
