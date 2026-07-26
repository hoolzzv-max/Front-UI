import { websocketService } from "@/services/websocket";
import type { StreamTransport, TransportOptions } from "./types";

export class WebSocketTransport implements StreamTransport {
  readonly type = "websocket" as const;
  private connected = false;
  private currentUrl: string | null = null;
  private options: TransportOptions = {};

  async connect(url: string, options?: TransportOptions): Promise<void> {
    this.currentUrl = url;
    this.options = options ?? {};
    if (this.options.onStatus) { this.options.onStatus("connecting"); }
    websocketService.connect(url);
    this.connected = true;
    if (this.options.onStatus) { this.options.onStatus("connected"); }
  }

  async disconnect(): Promise<void> {
    websocketService.disconnect();
    this.connected = false;
    this.currentUrl = null;
    if (this.options.onStatus) { this.options.onStatus("disconnected"); }
  }

  isConnected(): boolean { return this.connected && websocketService.isConnected(); }
  send(data: unknown): boolean { return websocketService.send(data); }
  getUrl(): string | null { return this.currentUrl; }
}

export const webSocketTransport = new WebSocketTransport();
