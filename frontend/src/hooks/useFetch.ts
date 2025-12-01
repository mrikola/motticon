import { useEffect, useState, useCallback } from "react";
import { ApiException } from "../services/ApiService";

type UseFetchOptions<T> = {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiException) => void;
  skipInitialFetch?: boolean;
};

type UseFetchResult<T> = {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

/**
 * Custom hook for fetching data with loading and error states
 * Replaces the common pattern: useEffect(() => { const fetchData = async () => { ... }; fetchData(); }, [deps])
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[],
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const { enabled = true, onSuccess, onError, skipInitialFetch = false } =
    options;
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!skipInitialFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof ApiException
          ? err.message
          : "An unexpected error occurred";
      setError(errorMessage);
      if (err instanceof ApiException) {
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFn, enabled, onSuccess, onError]);

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, skipInitialFetch]);

  return { data, loading, error, refetch: fetchData };
}

