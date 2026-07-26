import { create } from "zustand";

import type { ApplicationSettings } from "../types";
import { localStorageDriver } from "@/core/storage/LocalStorage";
import { agentService } from "@/agents";

const STORAGE_KEY = "app-settings";

const DEFAULT_SETTINGS: ApplicationSettings = {
  theme: "dark",

  connection: {
    apiUrl: import.meta.env.VITE_API_URL ?? "",
    websocketUrl: import.meta.env.VITE_WS_URL ?? "",
    token: import.meta.env.VITE_AGENT_API_TOKEN ?? "",
    transportType: "http",
  },

  editor: {
    fontSize: 14,
    wordWrap: true,
    minimap: true,
    autoSave: false,
  },
};

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed";

type SettingsState = {
  settings: ApplicationSettings;
  connectionStatus: ConnectionStatus;

  updateSettings: (patch: Partial<ApplicationSettings>) => void;
  updateConnection: (patch: Partial<ApplicationSettings["connection"]>) => void;
  updateEditor: (patch: Partial<ApplicationSettings["editor"]>) => void;

  testConnection: () => Promise<void>;
  applyAndConnect: () => Promise<void>;
  reset: () => void;
};

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

  testConnection: async () => {
    const { settings } = get();
    set({ connectionStatus: "connecting" });
    try {
      const status = await agentService.testConnection({
        apiUrl: settings.connection.apiUrl,
        websocketUrl: settings.connection.websocketUrl || undefined,
        token: settings.connection.token || undefined,
        transportType: settings.connection.transportType,
      });
      set({
        connectionStatus: status.status === "connected" ? "connected" : "failed",
      });
    } catch {
      set({ connectionStatus: "failed" });
    }
  },

  applyAndConnect: async () => {
    const { settings } = get();
    set({ connectionStatus: "connecting" });
    try {
      await agentService.connect({
        apiUrl: settings.connection.apiUrl,
        websocketUrl: settings.connection.websocketUrl || undefined,
        token: settings.connection.token || undefined,
        transportType: settings.connection.transportType,
      });
      set({ connectionStatus: "connected" });
    } catch {
      set({ connectionStatus: "failed" });
    }
  },

  reset: () => {
    localStorageDriver.set(STORAGE_KEY, DEFAULT_SETTINGS);
    set({ settings: DEFAULT_SETTINGS, connectionStatus: "idle" });
  },
}));
