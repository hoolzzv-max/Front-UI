import { connectionManager } from "../connection";

import { localStorageDriver } from "../storage/LocalStorage";

const SETTINGS_KEY =
  "app-settings";

export async function connectApplication() {
  const settings =
    localStorageDriver.get<any>(
      SETTINGS_KEY,
      null,
    );

  if (!settings) {
    return;
  }

  await connectionManager.connectAll({
    apiUrl:
      settings.connection?.apiUrl ??
      "",

    websocketUrl:
      settings.connection
        ?.websocketUrl ?? "",
  });
}
