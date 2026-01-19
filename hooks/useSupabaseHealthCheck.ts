/**
 * Custom hook for checking Supabase health
 *
 * Checks if Supabase is reachable on component mount.
 * Useful for free tier projects that pause after inactivity.
 *
 * @param timeoutMs - Timeout duration in milliseconds
 * @param onError - Optional callback when health check fails
 * @returns Object with isHealthy boolean state
 *
 * @example
 * ```typescript
 * const { isHealthy } = useSupabaseHealthCheck(
 *   API_TIMEOUTS.supabaseHealthCheck,
 *   () => toast.error("Database is currently unavailable")
 * );
 * ```
 */

import { useEffect, useState } from "react";

export function useSupabaseHealthCheck(
  timeoutMs: number,
  onError?: () => void
) {
  const [isHealthy, setIsHealthy] = useState(true);

  useEffect(() => {
    const checkSupabaseHealth = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        // Direct fetch to Supabase REST endpoint with timeout
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
          {
            method: "HEAD",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (!response.ok && response.status >= 500) {
          throw new Error("Supabase unavailable");
        }

        setIsHealthy(true);
      } catch {
        clearTimeout(timeoutId);
        setIsHealthy(false);
        onError?.();
      }
    };

    checkSupabaseHealth();
  }, [timeoutMs, onError]);

  return { isHealthy };
}
