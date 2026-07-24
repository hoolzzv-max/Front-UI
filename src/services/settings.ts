export interface ApplicationSettings {
  theme: "light" | "dark" | "system";

  fontSize: number;

  autosave: boolean;

  wordWrap: boolean;
}

const DEFAULT_SETTINGS: ApplicationSettings = {
  theme: "dark",
  fontSize: 14,
  autosave: false,
  wordWrap: true,
};

export class SettingsService {
  private settings: ApplicationSettings =
    DEFAULT_SETTINGS;

  getSettings() {
    return this.settings;
  }

  update(
    patch: Partial<ApplicationSettings>,
  ) {
    this.settings = {
      ...this.settings,
      ...patch,
    };

    return this.settings;
  }

  reset() {
    this.settings =
      DEFAULT_SETTINGS;

    return this.settings;
  }
}

export const settingsService =
  new SettingsService();
