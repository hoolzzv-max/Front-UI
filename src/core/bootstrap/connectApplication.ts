import { connectionManager } from "../connection";
import { localStorageDriver } from "../storage/LocalStorage";
import { agentService } from "../../agents";
import { agentRegistry } from "../../agents/core/registry";

const SETTINGS_KEY = "app-settings";

interface SavedSettings {
  connection?: {
    agentUrl?: string;
    /** Legacy key — still supported for backward compat */
    apiUrl?: string;
    websocketUrl?: string;
    token?: string;
  };
}

export async function connectApplication() {
  const settings = localStorageDriver.get<SavedSettings>(SETTINGS_KEY);
  if (!settings || typeof settings !== "object") return;

  const connection = settings.connection ?? {};

  // Resolve the effective agent URL — prefer new key, fall back to legacy
  const agentUrl = (connection.agentUrl ?? connection.apiUrl ?? "").trim();
  const websocketUrl = (connection.websocketUrl ?? "").trim();
  const token = (connection.token ?? "").trim();

  // Select the correct adapter before configuring
  const targetAdapterId = agentUrl ? "current" : "mock";
  if (agentRegistry.hasAdapter(targetAdapterId)) {
    agentRegistry.setActive(targetAdapterId);
  }

  if (agentUrl) {
    // Configure the agent service with saved settings
    agentService.configure({
      apiUrl: agentUrl,
      websocketUrl: websocketUrl || undefined,
      token: token || undefined,
    });

    // Align ConnectionManager to use agentUrl for HTTP status checks
    await connectionManager.connectAll({
      apiUrl: agentUrl,
      websocketUrl: websocketUrl,
    });
  }
}
