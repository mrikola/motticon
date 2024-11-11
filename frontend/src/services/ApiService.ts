import { z } from "zod";

// Zod schemas for validation

const LoginResponseSchema = z.object({
  token: z.string()
});

// Type inference from schemas
type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Define error categories
export type ApiErrorType = 
  | 'validation'   // Schema validation errors, malformed data
  | 'auth'         // Authentication/authorization errors
  | 'network'      // Network connectivity issues
  | 'server'       // Internal server errors
  | 'notFound'     // Resource not found
  | 'conflict'     // Resource conflicts
  | 'unknown';     // Unhandled errors

export class ApiException extends Error {
  constructor(
    public status: number, 
    message: string,
    public type: ApiErrorType
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Helper to categorize HTTP status codes
const categorizeError = (status: number, message: string): ApiException => {
  switch (true) {
    case status === 400:
      return new ApiException(status, message, 'validation');
    case status === 401 || status === 403:
      return new ApiException(status, message, 'auth');
    case status === 404:
      return new ApiException(status, message, 'notFound');
    case status === 409:
      return new ApiException(status, message, 'conflict');
    case status >= 500:
      return new ApiException(status, message, 'server');
    default:
      return new ApiException(status, message, 'unknown');
  }
};

// Request types (no validation needed for outgoing requests)
interface LoginRequest {
  email: string;
  password: string;
}

// Legacy methods
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

// Legacy exports
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

// New typed API client
export class ApiClient {
  private static baseUrl = import.meta.env.VITE_API_URL;

  private static async request<T>(
    endpoint: string,
    options: RequestInit,
    schema: z.ZodType<T>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('user') || '',
          Origin: import.meta.env.VITE_FRONTEND_URL,
          ...options.headers,
        },
      });

      const rawData = await response.json();
      
      // Validate response data against schema
      const result = schema.safeParse(rawData);
      
      if (!response.ok || !result.success) {
        if (!response.ok) {
          throw categorizeError(response.status, await response.text());
        }
        throw new ApiException(500, 'Invalid response format from server', 'validation');
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      // Network errors from fetch
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiException(0, 'Network connection failed', 'network');
      }
      throw new ApiException(500, 'Unknown error occurred', 'unknown');
    }
  }

  // Auth endpoints
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>(
      '/user/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      LoginResponseSchema
    );
  }

  // Add more typed endpoints as needed...
}
