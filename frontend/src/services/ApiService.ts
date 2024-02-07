const getHeaders = () => ({
  "Content-type": "application/json",
  Authorization: localStorage.getItem("user") || "",
  Origin: import.meta.env.VITE_FRONTEND_URL,
});

const getFileFormHeaders = () => ({
  Authorization: localStorage.getItem("user") || "",
  Origin: import.meta.env.VITE_FRONTEND_URL,
});

export const getURL = (path: string) =>
  new URL(`${import.meta.env.VITE_API_URL}${path}`);

const doFetch = (url: URL, method: string, body?: any) =>
  fetch(url, {
    method,
    mode: "cors",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

// TODO error handling and shit

export const get = (path: string) => doFetch(getURL(path), "GET");
export const post = (path: string, body: any) =>
  doFetch(getURL(path), "POST", body);
export const put = (path: string, body?: any) =>
  doFetch(getURL(path), "PUT", body);

export const postFormData = (path: string, formData: FormData) => {
  return fetch(getURL(path), {
    method: "POST",
    mode: "cors",
    headers: getFileFormHeaders(),
    body: formData,
  });
};
