// ============================================================
// ITransport — transport layer interface.
// Knows HOW to send/receive bytes, not WHAT they mean.
// ============================================================

export interface ITransport {
  /** Perform an HTTP-style request */
  request<T>(endpoint: string, options?: TransportRequestOptions): Promise<T>;

  /** Open a persistent connection (WebSocket / SSE) */
  connect(url: string): void;

  /** Close the persistent connection */
  disconnect(): void;

  /** True when a persistent connection is open */
  isConnected(): boolean;

  /** Subscribe to raw incoming messages */
  subscribe(handler: (raw: string) => void): () => void;
}

export interface TransportRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export interface TransportConfig {
  baseUrl: string;
  token?: string;
  timeoutMs?: number;
}
