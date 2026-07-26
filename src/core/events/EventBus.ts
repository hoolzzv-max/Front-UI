import { AppError } from "../errors/AppError";
import { ERROR_CODES } from "../errors/ErrorCodes";

export type EventMap = Record<string, unknown>;

export type EventHandler<Payload> = (payload: Payload) => void | Promise<void>;

export type EventSubscription = () => void;

export class EventBus<Events extends EventMap = EventMap> {
  private listeners = new Map<keyof Events, Set<EventHandler<Events[keyof Events]>>>();

  on<EventName extends keyof Events>(
    eventName: EventName,
    handler: EventHandler<Events[EventName]>,
  ): EventSubscription {
    const handlers = this.listeners.get(eventName) ?? new Set();
    handlers.add(handler as EventHandler<Events[keyof Events]>);
    this.listeners.set(eventName, handlers);
    return () => this.off(eventName, handler);
  }

  once<EventName extends keyof Events>(
    eventName: EventName,
    handler: EventHandler<Events[EventName]>,
  ): EventSubscription {
    const unsubscribe = this.on(eventName, async (payload) => {
      unsubscribe();
      await handler(payload);
    });
    return unsubscribe;
  }

  off<EventName extends keyof Events>(
    eventName: EventName,
    handler: EventHandler<Events[EventName]>,
  ) {
    const handlers = this.listeners.get(eventName);
    if (!handlers) return;
    handlers.delete(handler as EventHandler<Events[keyof Events]>);
    if (handlers.size === 0) this.listeners.delete(eventName);
  }

  async emit<EventName extends keyof Events>(
    eventName: EventName,
    payload: Events[EventName],
  ) {
    const handlers = this.listeners.get(eventName);
    if (!handlers || handlers.size === 0) return;

    const errors: AppError[] = [];
    for (const handler of handlers) {
      try {
        await handler(payload as Events[keyof Events]);
      } catch (error) {
        errors.push(
          new AppError(`Event handler failed for "${String(eventName)}".`, {
            code: ERROR_CODES.EVENT_HANDLER_ERROR,
            cause: error,
            details: { eventName, payload },
          }),
        );
      }
    }

    if (errors.length > 0) {
      throw new AppError(`One or more handlers failed for "${String(eventName)}".`, {
        code: ERROR_CODES.EVENT_HANDLER_ERROR,
        details: errors.map((e) => e.toJSON()),
      });
    }
  }

  clear<EventName extends keyof Events>(eventName?: EventName) {
    if (eventName) {
      this.listeners.delete(eventName);
      return;
    }
    this.listeners.clear();
  }

  listenerCount<EventName extends keyof Events>(eventName: EventName) {
    return this.listeners.get(eventName)?.size ?? 0;
  }
}

export type WorkspaceEventMap = {
  "app:ready": { timestamp: string };

  "api:error": { message: string; status?: number; code?: string };

  "console:output": { content: string; commandId?: string };
  "console:error": { content: string; commandId?: string };

  "task:created": { taskId: string; title: string };
  "task:updated": { taskId: string; status?: string; progress?: number };

  // Generic agent events — no specific agent name
  "agent:message": { taskId?: string; content: string };
  "agent:files-changed": { files: string[] };
  "agent:status-changed": { status: "unknown" | "online" | "offline"; version?: string };
  "agent:error": { message: string; code?: string; recoverable?: boolean };
  "agent:log": { level: "info" | "warn" | "error" | "debug"; message: string; taskId?: string };
  "agent:task-updated": { taskId: string; status: string; progress?: number };

  "git:changed": { branch: string; files: string[] };

  "websocket:status": {
    status: "idle" | "connecting" | "connected" | "reconnecting" | "disconnected" | "error";
    url?: string;
  };
  "websocket:message": { type?: string; payload: unknown; raw: string };
  "websocket:error": { message: string };
  "websocket:closed": { code: number; reason: string; wasClean: boolean };
};

export const eventBus = new EventBus<WorkspaceEventMap>();
