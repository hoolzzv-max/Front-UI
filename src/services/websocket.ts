export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected";

type MessageHandler = (
  payload: unknown,
) => void;

export class WebSocketService {
  private socket: WebSocket | null =
    null;

  private status: ConnectionStatus =
    "idle";

  private handlers =
    new Set<MessageHandler>();

  getStatus() {
    return this.status;
  }

  connect(url: string) {
    if (
      this.socket &&
      this.status === "connected"
    ) {
      return;
    }

    this.status =
      "connecting";

    this.socket =
      new WebSocket(url);

    this.socket.onopen = () => {
      this.status =
        "connected";
    };

    this.socket.onclose = () => {
      this.status =
        "disconnected";
    };

    this.socket.onmessage = (
      event,
    ) => {
      try {
        const payload =
          JSON.parse(
            event.data,
          );

        this.handlers.forEach(
          (handler) =>
            handler(payload),
        );
      } catch {
        //
      }
    };
  }

  send(data: unknown) {
    if (
      !this.socket ||
      this.status !==
        "connected"
    ) {
      return;
    }

    this.socket.send(
      JSON.stringify(data),
    );
  }

  subscribe
