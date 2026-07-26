import type { AgentTransportType } from "../core/AgentTypes";

export interface Transport {
  readonly type: AgentTransportType;
  connect(url: string, options?: TransportOptions): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

export interface TransportOptions {
  token?: string;
  headers?: Record<string, string>;
  onMessage?: (data: unknown) => void;
  onStatus?: (status: string) => void;
  onError?: (error: Error) => void;
}

export interface RequestTransport extends Transport {
  request<T>(method: string, endpoint: string, body?: unknown, options?: RequestTransportOptions): Promise<T>;
}

export interface RequestTransportOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface StreamTransport extends Transport {
  send(data: unknown): boolean;
}
