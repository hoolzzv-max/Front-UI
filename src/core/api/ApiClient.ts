import { AppError } from "../errors/AppError";
import { ERROR_CODES, getErrorCodeFromStatus } from "../errors/ErrorCodes";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiClientConfig = {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

export type ApiRequestOptions = {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | null | undefined>;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
};

type RequestPayload = object | unknown[] | string | number | boolean | null;

const DEFAULT_TIMEOUT_MS = 30_000;

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function normalizeEndpoint(endpoint: string) {
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
}

function isJsonContentType(headers: Headers) {
  return headers.get("content-type")?.includes("application/json") ?? false;
}

function createTimeoutSignal(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cancel: () => window.clearTimeout(timeoutId),
  };
}

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl ? trimTrailingSlash(config.baseUrl) : "";
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.defaultHeaders = config.headers ?? {};
  }

  configure(config: ApiClientConfig) {
    if (config.baseUrl !== undefined) {
      this.baseUrl = trimTrailingSlash(config.baseUrl);
    }

    if (config.timeoutMs !== undefined) {
      this.timeoutMs = config.timeoutMs;
    }

    if (config.headers !== undefined) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        ...config.headers,
      };
    }
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  get<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  post<T>(endpoint: string, body?: RequestPayload, options?: ApiRequestOptions) {
    return this.request<T>("POST", endpoint, body, options);
  }

  put<T>(endpoint: string, body?: RequestPayload, options?: ApiRequestOptions) {
    return this.request<T>("PUT", endpoint, body, options);
  }

  patch<T>(endpoint: string, body?: RequestPayload, options?: ApiRequestOptions) {
    return this.request<T>("PATCH", endpoint, body, options);
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }

  async request<T>(
    method: ApiMethod,
    endpoint: string,
    body?: RequestPayload,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const timeoutMs = options.timeoutMs ?? this.timeoutMs;
    const timeout = createTimeoutSignal(timeoutMs);

    const signal = options.signal ?? timeout.signal;

    try {
      const response = await fetch(this.buildUrl(endpoint, options.query), {
        method,
        headers: this.createHeaders(options.headers, body !== undefined),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });

      const data = await this.parseResponse<T>(response);

      if (!response.ok) {
        throw new AppError(`API request failed with status ${response.status}.`, {
          code: getErrorCodeFromStatus(response.status),
          status: response.status,
          details: data,
        });
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      if (error instanceof DOMException && error.name === "AbortError") {
        throw new AppError("API request timed out.", {
          code: ERROR_CODES.API_TIMEOUT,
          cause: error,
          recoverable: true,
        });
      }

      throw new AppError("API network request failed.", {
        code: ERROR_CODES.API_NETWORK_ERROR,
        cause: error,
        recoverable: true,
      });
    } finally {
      timeout.cancel();
    }
  }

  private buildUrl(
    endpoint: string,
    query?: Record<string, string | number | boolean | null | undefined>,
  ) {
    const url = `${this.baseUrl}${normalizeEndpoint(endpoint)}`;

    if (!query) return url;

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      params.set(key, String(value));
    });

    const queryString = params.toString();

    return queryString ? `${url}?${queryString}` : url;
  }

  private createHeaders(
    headers: Record<string, string> | undefined,
    hasBody: boolean,
  ) {
    const nextHeaders: Record<string, string> = {
      Accept: "application/json",
      ...this.defaultHeaders,
      ...headers,
    };

    if (hasBody && !nextHeaders["Content-Type"]) {
      nextHeaders["Content-Type"] = "application/json";
    }

    if (this.authToken) {
      nextHeaders.Authorization = `Bearer ${this.authToken}`;
    }

    return nextHeaders;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return null as T;
    }

    try {
      if (isJsonContentType(response.headers)) {
        return (await response.json()) as T;
      }

      return (await response.text()) as T;
    } catch (error) {
      throw new AppError("Failed to parse API response.", {
        code: ERROR_CODES.API_BAD_RESPONSE,
        status: response.status,
        cause: error,
      });
    }
  }
}

export const apiClient = new ApiClient();
