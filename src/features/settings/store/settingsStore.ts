import { create } from "zustand";

import type {
  ApplicationSettings,
} from "../types";

import { localStorageDriver } from "../../../core/storage/LocalStorage";
import { aiderService } from "../../../services/aider";

const STORAGE_KEY = "app-settings";

const DEFAULT_SETTINGS: ApplicationSettings = {
  theme: "dark",

  connection: {
    apiUrl: "",
    websocketUrl: "",
    aiderUrl: "",
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
  connectionStatus:
    | "idle"
    | "connecting"
    | "connected"
    | "failed";

  updateSettings: (
    patch: Partial<ApplicationSettings>,
  ) => void;

  updateConnection: (
    patch: Partial<ApplicationSettings["connection"]>,
  ) => void;

  updateEditor: (
    patch: Partial<ApplicationSettings["editor"]>,
  ) => void;

  testConnection: () => Promise<void>;

  reset: () => void;
};

export const useSettingsStore =
  create<SettingsState>((set) => ({
    settings:
      localStorageDriver.get(
        STORAGE_KEY,
        DEFAULT_SETTINGS,
      ),

    connectionStatus: "idle",

    updateSettings: (patch) => {
      set((state) => {
        const nextSettings = {
          ...state.settings,
          ...patch,
        };

        localStorageDriver.set(
          STORAGE_KEY,
          nextSettings,
        );

        return {
          settings: nextSettings,
        };
      });
    },

    updateConnection: (patch) => {
      set((state) => {
        const nextSettings = {
          ...state.settings,

          connection: {
            ...state.settings.connection,
            ...patch,
          },
        };

        localStorageDriver.set(
          STORAGE_KEY,
          nextSettings,
        );

        return {
          settings: nextSettings,
        };
      });
    },

    updateEditor: (patch) => {
      set((state) => {
        const nextSettings = {
          ...state.settings,

          editor: {
            ...state.settings.editor,
            ...patch,
          },
        };

        localStorageDriver.set(
          STORAGE_KEY,
          nextSettings,
        );

        return {
          settings: nextSettings,
        };
      });
    },

    testConnection: async () => {
      set({
        connectionStatus:
          "connecting",
      });

      try {
        const result =
          await aiderService.getStatus();

        set({
          connectionStatus:
            result.status === "online"
              ? "connected"
              : "failed",
        });
      } catch {
        set({
          connectionStatus:
            "failed",
        });
      }
    },

    reset: () => {
      set({
        settings: DEFAULT_SETTINGS,
        connectionStatus: "idle",
      });
    },
  }));
