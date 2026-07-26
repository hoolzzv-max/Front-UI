import type { StreamTransport, TransportOptions } from "./types";

export class SseTransport implements StreamTransport {
  readonly type = "sse" as const;
  private eventSource: EventSource | null = null;
  private connected = false;
  private currentUrl: string | null = null;
  private options: TransportOptions = {};

  async connect(url: string, options?: TransportOptions): Promise<void> {
    this.currentUrl = url;
    this.options = options ?? {};
    if (typeof EventSource === "undefined") {
      if (this.options.onError) { this.options.onError(new Error("EventSource is not available.")); }
      return;
    }
    if (this.options.onStatus) { this.options.onStatus("connecting"); }
    this.eventSource = new EventSource(url);
    this.eventSource.onopen = () => {
      this.connected = true;
      if (this.options.onStatus) { this.options.onStatus("connected"); }
    };
    this.eventSource.onmessage = (event) => {
      if (this.options.onMessage) {
        try { this.options.onMessage(JSON.parse(event.data)); } catch { this.options.onMessage(event.data); }
      }
    };
    this.eventSource.onerror = () => {
      this.connected = false;
      if (this.options.onError) { this.options.onError(new Error("SSE connection error.")); }
      if (this.options.onStatus) { this.options.onStatus("error"); }
    };
  }

  async disconnect(): Promise<void> {
    if (this.eventSource) { this.eventSource.close(); this.eventSource = null; }
    this.connected = false;
    this.currentUrl = null;
    if (this.options.onStatus) { this.options.onStatus("disconnected"); }
  }

  isConnected(): boolean { return this.connected; }
  send(_data: unknown): boolean { return false; }
}

export const sseTransport = new SseTransport();
