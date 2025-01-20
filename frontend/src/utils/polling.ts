export const startPolling = (fetchFn: () => void, interval: number = 10000) => {
  fetchFn();
  const pollInterval = setInterval(fetchFn, interval);
  return () => clearInterval(pollInterval);
};
