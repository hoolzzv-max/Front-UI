import { create } from "zustand";

import type {
  ApplicationSettings,
} from "../types";

import { localStorageDriver } from "../../../core/storage/LocalStorage";

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
    settings:
      localStorageDriver.get(
        STORAGE_KEY,
        DEFAULT_SETTINGS,
      ),

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

    reset: () => {
      set({
        settings: DEFAULT_SETTINGS,
      });
    },
  }));
