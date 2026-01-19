/**
 * Custom hook for typing animation effect
 *
 * Manages typing and untyping animation state for demo text display.
 * Combines typing animation with caret blinking for a terminal-like effect.
 *
 * @param phrases - Array of text strings to cycle through
 * @param typingSpeedBase - Base typing speed in milliseconds
 * @param typingSpeedVariation - Random variation in typing speed
 * @param typingDelay - Delay between typing and untyping
 * @param caretBlinkInterval - Interval for caret blinking
 * @returns Object with displayText and showCaret state
 *
 * @example
 * ```typescript
 * const { displayText, showCaret } = useTypingAnimation(
 *   ["Hello", "World"],
 *   ANIMATION_TIMINGS.typingSpeedBase,
 *   ANIMATION_TIMINGS.typingSpeedVariation,
 *   ANIMATION_TIMINGS.typingDelay,
 *   ANIMATION_TIMINGS.caretBlink
 * );
 * ```
 */

import { useEffect, useState } from "react";

export function useTypingAnimation(
  phrases: string[],
  typingSpeedBase: number,
  typingSpeedVariation: number,
  typingDelay: number,
  caretBlinkInterval: number
) {
  const [terminalText, setTerminalText] = useState("");
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCaret, setShowCaret] = useState(true);

  // Typing loop
  useEffect(() => {
    const currentText = phrases[terminalIndex];
    const delay = isTyping
      ? Math.random() * typingSpeedVariation + typingSpeedBase
      : typingDelay;

    const t = setTimeout(() => {
      if (isTyping) {
        if (charIndex < currentText.length) {
          setTerminalText(currentText.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setIsTyping(false), 1200);
        }
      } else {
        if (charIndex > 0) {
          setTerminalText(currentText.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setTerminalIndex((i) => (i + 1) % phrases.length);
          setIsTyping(true);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [charIndex, isTyping, terminalIndex, phrases, typingSpeedBase, typingSpeedVariation, typingDelay]);

  // Caret blinking
  useEffect(() => {
    const id = setInterval(() => setShowCaret((v) => !v), caretBlinkInterval);
    return () => clearInterval(id);
  }, [caretBlinkInterval]);

  return {
    displayText: terminalText,
    showCaret,
  };
}
