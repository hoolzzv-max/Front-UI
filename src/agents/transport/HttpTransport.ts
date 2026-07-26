// ============================================================
// HttpTransport — fetch-based HTTP transport.
// Only layer allowed to call fetch() for agent communication.
// ============================================================

import type { ITransport, TransportRequestOptions, TransportConfig } from "./types";
import { AppError } from "../../core/errors/AppError";
import { ERROR_CODES } from "../../core/errors/ErrorCodes";

export class HttpTransport implements ITransport {
  private baseUrl = "";
  private token: string | null = null;
  private timeoutMs: number;

  constructor(config?: TransportConfig) {
    this.baseUrl = config?.baseUrl ?? "";
    this.token = config?.token ?? null;
    this.timeoutMs = config?.timeoutMs ?? 30_000;
  }

  configure(config: TransportConfig): void {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    if (config.token !== undefined) this.token = config.token;
    if (config.timeoutMs !== undefined) this.timeoutMs = config.timeoutMs;
  }

  async request<T>(endpoint: string, options: TransportRequestOptions = {}): Promise<T> {
    const controller = new AbortController();
    const timerId = window.setTimeout(() => controller.abort(), this.timeoutMs);

    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      "Accept": "application/json",
      ...options.headers,
    };

    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: options.method ?? "GET",
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AppError(`HTTP ${response.status} from ${url}`, {
          code: ERROR_CODES.API_UNAUTHORIZED,
          status: response.status,
          recoverable: response.status >= 500,
        });
      }

      if (response.status === 204) return null as T;

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return (await response.json()) as T;
      }
      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new AppError("Agent request timed out.", {
          code: ERROR_CODES.API_TIMEOUT,
          recoverable: true,
        });
      }
      throw new AppError("Agent request failed — network error.", {
        code: ERROR_CODES.API_NETWORK_ERROR,
        cause: error,
        recoverable: true,
      });
    } finally {
      window.clearTimeout(timerId);
    }
  }

  // HTTP transport does not maintain a persistent connection
  connect(_url: string): void {}
  disconnect(): void {}
  isConnected(): boolean { return false; }
  subscribe(_handler: (raw: string) => void): () => void { return () => {}; }
}
