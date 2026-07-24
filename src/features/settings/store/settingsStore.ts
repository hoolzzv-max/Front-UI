import { create } from "zustand";

import type {
  ApplicationSettings,
} from "../types";

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

  updateSettings: (
    patch: Partial<ApplicationSettings>,
  ) => void;

  updateConnection: (
    patch: Partial<ApplicationSettings["connection"]>,
  ) => void;

  updateEditor: (
    patch: Partial<ApplicationSettings["editor"]>,
  ) => void;

  reset: () => void;
};

export const useSettingsStore =
  create<SettingsState>((set) => ({
    settings: DEFAULT_SETTINGS,

    updateSettings: (patch) => {
      set((state) => ({
        settings: {
          ...state.settings,
          ...patch,
        },
      }));
    },

    updateConnection: (patch) => {
      set((state) => ({
        settings: {
          ...state.settings,
          connection: {
            ...state.settings.connection,
            ...patch,
          },
        },
      }));
    },

    updateEditor: (patch) => {
      set((state) => ({
        settings: {
          ...state.settings,
          editor: {
            ...state.settings.editor,
            ...patch,
          },
        },
      }));
    },

    reset: () => {
      set({
        settings: DEFAULT_SETTINGS,
      });
    },
  }));
