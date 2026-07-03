"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseAutoFetchOptions<T> {
  initialData: T;
  intervalMs?: number;
  refetchOnFocus?: boolean;
}

export function useAutoFetch<T>(url: string, options: UseAutoFetchOptions<T>) {
  const { initialData, intervalMs = 30000, refetchOnFocus = true } = options;
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();
      setData(json.data ?? json);
    } catch (fetchError) {
      if ((fetchError as Error).name !== "AbortError") {
        setError((fetchError as Error).message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (intervalMs <= 0) return;

    const interval = window.setInterval(() => {
      void refetch();
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, refetch]);

  useEffect(() => {
    if (!refetchOnFocus) return;

    const handleFocus = () => {
      void refetch();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [refetch, refetchOnFocus]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { data, isLoading, error, refetch };
}
