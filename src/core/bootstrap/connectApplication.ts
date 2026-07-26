import { connectionManager } from "../connection";
import { localStorageDriver } from "../storage/LocalStorage";
import { agentService } from "../../agents";

const SETTINGS_KEY = "app-settings";

interface SavedSettings {
  connection?: {
    apiUrl?: string;
    websocketUrl?: string;
    agentUrl?: string;
    token?: string;
  };
}

export async function connectApplication() {
  const settings = localStorageDriver.get<SavedSettings>(SETTINGS_KEY);

  if (!settings || typeof settings !== "object") return;

  const connection = settings.connection ?? {};

  // Configure agent with saved settings
  if (connection.agentUrl || connection.apiUrl) {
    agentService.configure({
      apiUrl: connection.agentUrl ?? connection.apiUrl ?? "",
      websocketUrl: connection.websocketUrl ?? undefined,
      token: connection.token ?? undefined,
    });
  }

  await connectionManager.connectAll({
    apiUrl: connection.apiUrl ?? "",
    websocketUrl: connection.websocketUrl ?? "",
  });
}
