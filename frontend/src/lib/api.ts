import { AUTH_TOKEN_STORAGE_KEY } from "@/features/auth/constants";

const DEFAULT_API_BASE_URL = "http://192.168.1.40:5000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

type ApiRequestOptions = RequestInit & {
  authToken?: string | null;
  skipAuth?: boolean;
  timeoutMs?: number;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const requestUrl = `${API_BASE_URL}${normalizedPath}`;
  const controller = new AbortController();
  const { authToken, headers, skipAuth, timeoutMs, ...fetchOptions } = options;
  const timeout = setTimeout(
    () => controller.abort(),
    timeoutMs ?? 10000,
  );

  try {
    const requestHeaders = new Headers(headers);

    if (!requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    const token =
      skipAuth === true
        ? null
        : authToken ?? getBrowserAuthToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(requestUrl, {
      ...fetchOptions,
      headers: requestHeaders,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ApiError(
        errorBody || response.statusText || "API request failed",
        response.status,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function getBrowserAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getRequest<T>(path: string, options?: ApiRequestOptions) {
  return apiRequest<T>(path, {
    method: "GET",
    ...options,
  });
}

export function postRequest<T, TBody = unknown>(
  path: string,
  body: TBody,
  options?: ApiRequestOptions,
) {
  return apiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export function putRequest<T, TBody = unknown>(
  path: string,
  body: TBody,
  options?: ApiRequestOptions,
) {
  return apiRequest<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });
}

export function deleteRequest<T>(path: string, options?: ApiRequestOptions) {
  return apiRequest<T>(path, {
    method: "DELETE",
    ...options,
  });
}
