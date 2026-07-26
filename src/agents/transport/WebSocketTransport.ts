// ============================================================
// WebSocketTransport — wraps the existing websocketService.
// Only this file may interact with WebSocket for agent comms.
// ============================================================

import type { ITransport, TransportRequestOptions } from "./types";
import { websocketService } from "../../services/websocket";

export class WebSocketTransport implements ITransport {
  private readonly handlers = new Set<(raw: string) => void>();
  private unsubscribeFromService: (() => void) | null = null;

  connect(url: string): void {
    websocketService.connect(url);

    // Bridge raw WS messages to our handlers
    this.unsubscribeFromService = websocketService.subscribe((message) => {
      const raw = JSON.stringify(message.payload);
      this.handlers.forEach((h) => h(raw));
    });
  }

  disconnect(): void {
    this.unsubscribeFromService?.();
    this.unsubscribeFromService = null;
    websocketService.disconnect();
  }

  isConnected(): boolean {
    return websocketService.isConnected();
  }

  subscribe(handler: (raw: string) => void): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /** WebSocket transport sends via WS envelope; no REST semantics */
  async request<T>(_endpoint: string, options?: TransportRequestOptions): Promise<T> {
    const sent = websocketService.send({
      type: _endpoint,
      payload: options?.body,
      timestamp: new Date().toISOString(),
    });

    if (!sent) {
      throw new Error("WebSocketTransport: not connected — message queued.");
    }

    // For a proper request/response pattern over WS a promise + timeout
    // would be needed; for now this is fire-and-forget.
    return null as T;
  }
}
