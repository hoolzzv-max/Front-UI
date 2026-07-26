import { create } from "zustand";
import type { ApplicationSettings } from "../types";
import { localStorageDriver } from "../../../core/storage/LocalStorage";
import { agentService } from "../../../agents";
import { agentRegistry } from "../../../agents/core/registry";

const STORAGE_KEY = "app-settings";

const DEFAULT_SETTINGS: ApplicationSettings = {
  theme: "dark",
  connection: {
    agentUrl: import.meta.env.VITE_AGENT_API_URL ?? "",
    websocketUrl: import.meta.env.VITE_AGENT_WS_URL ?? "",
    token: import.meta.env.VITE_AGENT_API_TOKEN ?? "",
    transport: "http",
  },
  editor: {
    fontSize: 14,
    wordWrap: true,
    minimap: true,
    autoSave: false,
  },
};

type SettingsState = {
  settings: ApplicationSettings;
  connectionStatus: "idle" | "connecting" | "connected" | "failed";

  updateSettings: (patch: Partial<ApplicationSettings>) => void;
  updateConnection: (patch: Partial<ApplicationSettings["connection"]>) => void;
  updateEditor: (patch: Partial<ApplicationSettings["editor"]>) => void;
  testConnection: () => Promise<void>;
  applyConnectionToAgent: () => void;
  reset: () => void;
};

/**
 * Select the correct adapter based on whether a real URL is configured,
 * then configure it with the current settings.
 * Call this before any agentService usage so the right adapter is active.
 */
function selectAndConfigureAdapter(connection: ApplicationSettings["connection"]) {
  const hasRealUrl = connection.agentUrl.trim().length > 0;

  // Switch adapter: real URL → "current", no URL → "mock"
  const targetId = hasRealUrl ? "current" : "mock";
  if (agentRegistry.hasAdapter(targetId)) {
    agentRegistry.setActive(targetId);
  }

  if (hasRealUrl) {
    agentService.configure({
      apiUrl: connection.agentUrl.trim(),
      websocketUrl: connection.websocketUrl.trim() || undefined,
      token: connection.token.trim() || undefined,
    });
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: localStorageDriver.get(STORAGE_KEY, DEFAULT_SETTINGS),
  connectionStatus: "idle",

  updateSettings: (patch) => {
    set((state) => {
      const nextSettings = { ...state.settings, ...patch };
      localStorageDriver.set(STORAGE_KEY, nextSettings);
      return { settings: nextSettings };
    });
  },

  updateConnection: (patch) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        connection: { ...state.settings.connection, ...patch },
      };
      localStorageDriver.set(STORAGE_KEY, nextSettings);
      return { settings: nextSettings };
    });
  },

  updateEditor: (patch) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        editor: { ...state.settings.editor, ...patch },
      };
      localStorageDriver.set(STORAGE_KEY, nextSettings);
      return { settings: nextSettings };
    });
  },

  applyConnectionToAgent: () => {
    const { connection } = get().settings;
    selectAndConfigureAdapter(connection);
  },

  testConnection: async () => {
    const { connection } = get().settings;
    // Apply adapter selection + config before testing
    selectAndConfigureAdapter(connection);
    set({ connectionStatus: "connecting" });
    try {
      const online = await agentService.testConnection();
      set({ connectionStatus: online ? "connected" : "failed" });
    } catch {
      set({ connectionStatus: "failed" });
    }
  },

  reset: () => {
    localStorageDriver.set(STORAGE_KEY, DEFAULT_SETTINGS);
    set({ settings: DEFAULT_SETTINGS, connectionStatus: "idle" });
  },
}));
