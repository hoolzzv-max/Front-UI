// ============================================================
// ConnectionManager — orchestrates connection state.
// Uses agentService generically; no specific agent name here.
// ============================================================

import { eventBus } from "../events/EventBus";
import { apiService } from "../../services/api";
import { websocketService } from "../../services/websocket";

export type ConnectionState = "idle" | "connecting" | "connected" | "failed";

export interface ConnectionSnapshot {
  api: ConnectionState;
  websocket: ConnectionState;
  agent: ConnectionState;
}

export class ConnectionManager {
  private state: ConnectionSnapshot = {
    api: "idle",
    websocket: "idle",
    agent: "idle",
  };

  getState() {
    return { ...this.state };
  }

  private setState(service: keyof ConnectionSnapshot, state: ConnectionState) {
    this.state = { ...this.state, [service]: state };
    eventBus.emit("websocket:message", {
      type: "connection:update",
      payload: { service, state },
      raw: JSON.stringify({ service, state }),
    }).catch(() => {});
  }

  configureApi(baseUrl: string) {
    apiService.configure(baseUrl);
  }

  async testApi(endpoint = "/health") {
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

  async testAgent() {
    this.setState("agent", "connecting");
    try {
      // Import agentService — circular-safe since agents/ doesn't import connection/
      const { agentService } = await import("../../agents/core/service");
      const result = await agentService.getStatus();
      this.setState("agent", result.status === "online" ? "connected" : "failed");
      return result.status === "online";
    } catch {
      this.setState("agent", "failed");
      return false;
    }
  }

  async connectAll(settings: { apiUrl: string; websocketUrl: string }) {
    if (settings.apiUrl) {
      this.configureApi(settings.apiUrl);
      await this.testApi();
    }
    if (settings.websocketUrl) {
      this.connectWebSocket(settings.websocketUrl);
    }
    await this.testAgent();
  }
}

export const connectionManager = new ConnectionManager();
