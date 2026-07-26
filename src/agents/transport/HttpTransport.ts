import { apiClient } from "@/core/api/ApiClient";
import type { RequestTransport, RequestTransportOptions } from "./types";

export class HttpTransport implements RequestTransport {
  readonly type = "http" as const;
  private baseUrl = "";
  private token: string | null = null;

  async connect(url: string): Promise<void> {
    this.baseUrl = url;
    apiClient.configure({ baseUrl: url });
  }

  async disconnect(): Promise<void> {
    this.baseUrl = "";
    apiClient.clearAuthToken();
  }

  isConnected(): boolean {
    return this.baseUrl.length > 0;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) { apiClient.setAuthToken(token); } else { apiClient.clearAuthToken(); }
  }

  async request<T>(method: string, endpoint: string, body?: unknown, options?: RequestTransportOptions): Promise<T> {
    const apiOptions = options ? { headers: options.headers, signal: options.signal, timeoutMs: options.timeoutMs } : undefined;
    const response = await apiClient.request<T>(
      method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      endpoint,
      body as object | unknown[] | string | number | boolean | null | undefined,
      apiOptions,
    );
    return response.data;
  }
}

export const httpTransport = new HttpTransport();
