import { eventBus } from "../events/EventBus";

import { apiService } from "../../services/api";
import { websocketService } from "../../services/websocket";
import { aiderService } from "../../services/aider";

export type ConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "failed";

export interface ConnectionSnapshot {
  api: ConnectionState;
  websocket: ConnectionState;
  aider: ConnectionState;
}

export class ConnectionManager {
  private state: ConnectionSnapshot = {
    api: "idle",
    websocket: "idle",
    aider: "idle",
  };

  getState() {
    return this.state;
  }

  private setState(
    service: keyof ConnectionSnapshot,
    state: ConnectionState,
  ) {
    this.state = {
      ...this.state,
      [service]: state,
    };

    eventBus.emit("websocket:message", {
      type: "connection:update",
      payload: {
        service,
        state,
      },
      raw: JSON.stringify({
        service,
        state,
      }),
    }).catch(() => {});
  }

  configureApi(baseUrl: string) {
    apiService.configure(baseUrl);
  }

  async testApi(endpoint = "/") {
    this.setState("api", "connecting");

    try {
      await apiService.get(endpoint);

      this.setState("api", "connected");

      return true;
    } catch {
      this.setState("api", "failed");

      return false;
    }
  }

  connectWebSocket(url: string) {
    this.setState("websocket", "connecting");

    try {
      websocketService.connect(url);

      this.setState("websocket", "connected");

      return true;
    } catch {
      this.setState("websocket", "failed");

      return false;
    }
  }

  disconnectWebSocket() {
    websocketService.disconnect();

    this.setState("websocket", "idle");
  }

  async testAider() {
    this.setState("aider", "connecting");

    try {
      const result =
        await aiderService.getStatus();

      this.setState(
        "aider",
        result.status === "online"
          ? "connected"
          : "failed",
      );

      return result.status === "online";
    } catch {
      this.setState("aider", "failed");

      return false;
    }
  }

  async connectAll(settings: {
    apiUrl: string;
    websocketUrl: string;
  }) {
    if (settings.apiUrl) {
      this.configureApi(settings.apiUrl);
      await this.testApi();
    }

    if (settings.websocketUrl) {
      this.connectWebSocket(
        settings.websocketUrl,
      );
    }

    await this.testAider();
  }
}

export const connectionManager =
  new ConnectionManager();
