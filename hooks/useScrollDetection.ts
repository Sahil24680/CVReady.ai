/**
 * Custom hook for detecting scroll position
 *
 * Tracks whether the user has scrolled past a threshold,
 * useful for sticky headers and scroll-based UI changes.
 *
 * @param threshold - Scroll threshold in pixels (default: 50)
 * @returns Object with isScrolled boolean
 *
 * @example
 * ```typescript
 * const { isScrolled } = useScrollDetection(50);
 *
 * // Use for sticky navigation
 * <nav className={isScrolled ? "sticky shadow-lg" : "transparent"}>
 * ```
 */

import { useEffect, useState } from "react";

export function useScrollDetection(threshold: number = 50) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isScrolled };
}
