const getHeaders = () => ({
  "Content-type": "application/json",
  Authorization: localStorage.getItem("user") || "",
});

const getURL = (path: string) =>
  new URL(`${import.meta.env.VITE_API_URL}${path}`);

const doFetch = (url: URL, method: string, body?: any) =>
  fetch(url, { method, headers: getHeaders(), body: JSON.stringify(body) });

// TODO error handling and shit

export const get = (path: string) => doFetch(getURL(path), "GET");
export const post = (path: string, body: any) =>
  doFetch(getURL(path), "POST", body);
