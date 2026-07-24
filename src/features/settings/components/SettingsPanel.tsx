import { Save } from "lucide-react";

import { useSettingsStore } from "../store/settingsStore";

export function SettingsPanel() {
  const {
    settings,
    connectionStatus,
    testConnection,
    updateConnection,
    updateEditor,
    updateSettings,
  } = useSettingsStore();

  return (
    <div className="h-full overflow-auto bg-neutral-950 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold">
            Settings
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Configure Aider connection
            and editor preferences.
          </p>
        </div>

        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">
            Connections
          </h2>

          <div className="space-y-3">
            <input
              value={
                settings.connection
                  .aiderUrl
              }
              onChange={(e) =>
                updateConnection({
                  aiderUrl:
                    e.target.value,
                })
              }
              placeholder="Aider URL"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3"
            />

            <input
              value={
                settings.connection
                  .apiUrl
              }
              onChange={(e) =>
                updateConnection({
                  apiUrl:
                    e.target.value,
                })
              }
              placeholder="API URL"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3"
            />

            <input
              value={
                settings.connection
                  .websocketUrl
              }
              onChange={(e) =>
                updateConnection({
                  websocketUrl:
                    e.target.value,
                })
              }
              placeholder="WebSocket URL"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3"
            />
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={testConnection}
              disabled={connectionStatus === "connecting"}
              className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {connectionStatus === "connecting" ? "Testing..." : "Test Connection"}
            </button>

            <span className="text-sm text-neutral-400">
              {connectionStatus === "idle" && "⚪ Not tested"}
              {connectionStatus === "connecting" && "🔄 Connecting..."}
              {connectionStatus === "connected" && "🟢 Connected"}
              {connectionStatus === "failed" && "🔴 Failed"}
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">
            Editor
          </h2>

          <div className="space-y-4">
            <label className="block">
              <div className="mb-2 text-sm">
                Font Size
              </div>

              <input
                type="number"
                min={10}
                max={32}
                value={
                  settings.editor
                    .fontSize
                }
                onChange={(e) =>
                  updateEditor({
                    fontSize:
                      Number(
                        e.target.value,
                      ),
                  })
                }
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3"
              />
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  settings.editor
                    .wordWrap
                }
                onChange={(e) =>
                  updateEditor({
                    wordWrap:
                      e.target.checked,
                  })
                }
              />

              Word Wrap
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  settings.editor
                    .minimap
                }
                onChange={(e) =>
                  updateEditor({
                    minimap:
                      e.target.checked,
                  })
                }
              />

              Minimap
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  settings.editor
                    .autoSave
                }
                onChange={(e) =>
                  updateEditor({
                    autoSave:
                      e.target.checked,
                  })
                }
              />

              Auto Save
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">
            Appearance
          </h2>

          <select
            value={settings.theme}
            onChange={(e) =>
              updateSettings({
                theme:
                  e.target.value as any,
              })
            }
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3"
          >
            <option value="dark">
              Dark
            </option>

            <option value="light">
              Light
            </option>

            <option value="system">
              System
            </option>
          </select>
        </section>

        <button
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white"
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
