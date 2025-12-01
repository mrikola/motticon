import { useEffect } from "react";
import { startPolling } from "../utils/polling";

type UsePollingOptions = {
  enabled?: boolean;
  interval?: number;
};

/**
 * Custom hook for polling data
 * Replaces the common pattern: useEffect(() => { return startPolling(() => fetchData()); }, [deps])
 */
export function usePolling(
  fetchFn: () => void | Promise<void>,
  deps: unknown[],
  options: UsePollingOptions = {}
): void {
  const { enabled = true, interval = 10000 } = options;

  useEffect(() => {
    if (!enabled) return;

    return startPolling(fetchFn, interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, interval]);
}

