import { eventBus } from "../core/events/EventBus";
import { AppError } from "../core/errors/AppError";
import { ERROR_CODES } from "../core/errors/ErrorCodes";

export type WebSocketConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export type WebSocketMessageEnvelope<TPayload = unknown> = {
  type?: string;
  payload: TPayload;
  timestamp?: string;
  requestId?: string;
};

export type WebSocketMessageHandler<TPayload = unknown> = (
  message: WebSocketMessageEnvelope<TPayload>,
) => void | Promise<void>;

export type WebSocketServiceOptions = {
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelayMs?: number;
};

type QueuedMessage = {
  data: unknown;
};

const DEFAULT_OPTIONS: Required<WebSocketServiceOptions> = {
  reconnect: true,
  maxReconnectAttempts: 10,
  reconnectDelayMs: 1_000,
};

function isBrowser() {
  return typeof window !== "undefined" && typeof WebSocket !== "undefined";
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeIncomingMessage(raw: string): WebSocketMessageEnvelope {
  const parsed = safeJsonParse(raw);

  if (
    parsed &&
    typeof parsed === "object" &&
    "payload" in parsed
  ) {
    return parsed as WebSocketMessageEnvelope;
  }

  return {
    payload: parsed,
    timestamp: new Date().toISOString(),
  };
}

async function emitSafely<EventName extends Parameters<typeof eventBus.emit>[0]>(
  eventName: EventName,
  payload: Parameters<typeof eventBus.emit<EventName>>[1],
) {
  try {
    await eventBus.emit(eventName, payload);
  } catch {
    // Event handler errors must not break websocket flow.
  }
}

export class WebSocketService {
  private socket: WebSocket | null = null;

  private url: string | null = null;

  private status: WebSocketConnectionStatus = "idle";

  private readonly options: Required<WebSocketServiceOptions>;

  private reconnectAttempts = 0;

  private reconnectTimer: number | null = null;

  private manuallyClosed = false;

  private readonly handlers = new Set<WebSocketMessageHandler>();

  private readonly typedHandlers = new Map<string, Set<WebSocketMessageHandler>>();

  private readonly queue: QueuedMessage[] = [];

  constructor(options: WebSocketServiceOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  getStatus() {
    return this.status;
  }

  getUrl() {
    return this.url;
  }

  isConnected() {
    return this.status === "connected" && this.socket?.readyState === WebSocket.OPEN;
  }

  connect(url: string) {
    if (!isBrowser()) {
      this.setStatus("error");

      throw new AppError("WebSocket is not available in this environment.", {
        code: ERROR_CODES.WEBSOCKET_CONNECTION_FAILED,
        recoverable: false,
      });
    }

    if (this.socket && this.isConnected() && this.url === url) {
      return;
    }

    this.url = url;
    this.manuallyClosed = false;

    this.cleanupSocket();
    this.openSocket(url);
  }

  disconnect() {
    this.manuallyClosed = true;
    this.clearReconnectTimer();

    if (!this.socket) {
      this.setStatus("disconnected");
      return;
    }

    this.socket.close(1000, "Client disconnected");
    this.cleanupSocket();
    this.setStatus("disconnected");
  }

  send(data: unknown) {
    if (!this.isConnected()) {
      this.queue.push({ data });
      return false;
    }

    this.socket?.send(JSON.stringify(data));
    return true;
  }

  sendEnvelope<TPayload>(
    envelope: WebSocketMessageEnvelope<TPayload>,
  ) {
    return this.send({
      ...envelope,
      timestamp: envelope.timestamp ?? new Date().toISOString(),
    });
  }

  subscribe(handler: WebSocketMessageHandler) {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  subscribeToType<TPayload = unknown>(
    type: string,
    handler: WebSocketMessageHandler<TPayload>,
  ) {
    const handlers = this.typedHandlers.get(type) ?? new Set();

    handlers.add(handler as WebSocketMessageHandler);
    this.typedHandlers.set(type, handlers);

    return () => {
      const currentHandlers = this.typedHandlers.get(type);

      if (!currentHandlers) return;

      currentHandlers.delete(handler as WebSocketMessageHandler);

      if (currentHandlers.size === 0) {
        this.typedHandlers.delete(type);
      }
    };
  }

  clearHandlers() {
    this.handlers.clear();
    this.typedHandlers.clear();
  }

  private openSocket(url: string) {
    this.setStatus(this.reconnectAttempts > 0 ? "reconnecting" : "connecting");

    try {
      this.socket = new WebSocket(url);
    } catch (error) {
      this.setStatus("error");

      void emitSafely("websocket:error", {
        message: error instanceof Error ? error.message : "Failed to create WebSocket.",
      });

      throw new AppError("Failed to create WebSocket connection.", {
        code: ERROR_CODES.WEBSOCKET_CONNECTION_FAILED,
        cause: error,
      });
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus("connected");
      this.flushQueue();
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onerror = () => {
      this.setStatus("error");

      void emitSafely("websocket:error", {
        message: "WebSocket error occurred.",
      });
    };

    this.socket.onclose = (event) => {
      this.cleanupSocket();
      this.setStatus("disconnected");

      void emitSafely("websocket:closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });

      if (!this.manuallyClosed) {
        this.scheduleReconnect();
      }
    };
  }

  private async handleMessage(rawData: unknown) {
    const raw = typeof rawData === "string" ? rawData : String(rawData);
    const message = normalizeIncomingMessage(raw);

    void emitSafely("websocket:message", {
      type: message.type,
      payload: message.payload,
      raw,
    });

    for (const handler of this.handlers) {
      await handler(message);
    }

    if (message.type) {
      const handlers = this.typedHandlers.get(message.type);

      if (handlers) {
        for (const handler of handlers) {
          await handler(message);
        }
      }
    }
  }

  private flushQueue() {
    if (!this.isConnected()) return;

    while (this.queue.length > 0) {
      const queued = this.queue.shift();

      if (!queued) continue;

      this.socket?.send(JSON.stringify(queued.data));
    }
  }

  private scheduleReconnect() {
    if (!this.options.reconnect) return;
    if (!this.url) return;

    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.setStatus("error");

      void emitSafely("websocket:error", {
        message: "Maximum WebSocket reconnect attempts reached.",
      });

      return;
    }

    this.reconnectAttempts += 1;
    this.setStatus("reconnecting");

    this.clearReconnectTimer();

    const delay =
      this.options.reconnectDelayMs * Math.min(this.reconnectAttempts, 5);

    this.reconnectTimer = window.setTimeout(() => {
      if (!this.url || this.manuallyClosed) return;

      this.openSocket(this.url);
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer === null) return;

    window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  private cleanupSocket() {
    if (!this.socket) return;

    this.socket.onopen = null;
    this.socket.onmessage = null;
    this.socket.onerror = null;
    this.socket.onclose = null;
    this.socket = null;
  }

  private setStatus(status: WebSocketConnectionStatus) {
    this.status = status;

    void emitSafely("websocket:status", {
      status,
      url: this.url ?? undefined,
    });
  }
}

export const websocketService = new WebSocketService();
