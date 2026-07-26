import { agentService } from "@/agents";
import { localStorageDriver } from "../storage/LocalStorage";
import type { ApplicationSettings } from "@/features/settings/types";

const SETTINGS_KEY = "app-settings";

export async function connectApplication() {
  const settings = localStorageDriver.get<ApplicationSettings | null>(SETTINGS_KEY, null);
  if (!settings?.connection?.apiUrl) { return; }
  try {
    await agentService.connect({
      apiUrl: settings.connection.apiUrl,
      websocketUrl: settings.connection.websocketUrl || undefined,
      token: settings.connection.token || undefined,
      transportType: settings.connection.transportType ?? "http",
    });
  } catch {
    // Connection failure is non-fatal — the UI still renders.
  }
}
