const DEFAULT_API_BASE_URL = "http://192.168.1.40:5000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

type ApiRequestOptions = RequestInit & {
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
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 10000,
  );

  try {
    const response = await fetch(requestUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
