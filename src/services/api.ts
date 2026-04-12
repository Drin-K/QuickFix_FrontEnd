type QueryValue = string | number | boolean | null | undefined;

type RequestQuery = Record<string, QueryValue>;

type RequestBody = BodyInit | Record<string, unknown> | unknown[] | null | undefined;

export type ApiRequestOptions = Omit<RequestInit, "body" | "method"> & {
  body?: RequestBody;
  query?: RequestQuery;
  token?: string;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_API_URL = "http://localhost:3001/api";

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, "");

const buildUrl = (path: string, query?: RequestQuery): string => {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL || DEFAULT_API_URL);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

const isFormData = (value: RequestBody): value is FormData => typeof FormData !== "undefined" && value instanceof FormData;

const isBlob = (value: RequestBody): value is Blob => typeof Blob !== "undefined" && value instanceof Blob;

const isArrayBuffer = (value: RequestBody): value is ArrayBuffer => value instanceof ArrayBuffer;

const isUrlSearchParams = (value: RequestBody): value is URLSearchParams => value instanceof URLSearchParams;

const isBodyInit = (value: RequestBody): value is BodyInit =>
  typeof value === "string" ||
  isFormData(value) ||
  isBlob(value) ||
  isArrayBuffer(value) ||
  isUrlSearchParams(value);

const parseResponse = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const request = async <T>(method: string, path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { body, headers, query, token, ...rest } = options;
  const requestHeaders = new Headers(headers);
  let requestBody: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    if (isBodyInit(body)) {
      requestBody = body;
    } else {
      requestHeaders.set("Content-Type", "application/json");
      requestBody = JSON.stringify(body);
    }
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    ...rest,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message
        : `API request failed with status ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
};

export const api = {
  get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("POST", path, options);
  },

  put<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("PUT", path, options);
  },

  patch<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("PATCH", path, options);
  },

  delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("DELETE", path, options);
  },
};

export const getHello = (): Promise<string> => api.get<string>("/");

export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildUrl(""), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.log(`Connection failed: ${response.status}`);
      return false;
    }

    console.log("Connected!");
    return true;
  } catch (error) {
    console.error("Backend not reachable:", error);
    return false;
  }
};
