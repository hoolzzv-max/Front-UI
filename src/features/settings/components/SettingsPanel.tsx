import { Save, RotateCcw } from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";

const STATUS_LABELS: Record<string, string> = {
  idle: "⚪ Not tested",
  connecting: "🔄 Connecting…",
  connected: "🟢 Connected",
  failed: "🔴 Failed — check URL and token",
};

export function SettingsPanel() {
  const {
    settings,
    connectionStatus,
    testConnection,
    updateConnection,
    updateEditor,
    updateSettings,
    reset,
  } = useSettingsStore();

  return (
    <div className="h-full overflow-auto bg-neutral-950 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configure your agent connection and editor preferences.
          </p>
        </div>

        {/* Connection */}
        <section className="rounded-2xl border border-neutral-800 p-4 space-y-4">
          <h2 className="text-sm font-medium">Agent Connection</h2>

          <label className="block space-y-1">
            <span className="text-xs text-neutral-400">Agent API URL</span>
            <input
              value={settings.connection.agentUrl}
              onChange={(e) => updateConnection({ agentUrl: e.target.value })}
              placeholder="http://localhost:8000"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-neutral-400">WebSocket URL (optional, for streaming)</span>
            <input
              value={settings.connection.websocketUrl}
              onChange={(e) => updateConnection({ websocketUrl: e.target.value })}
              placeholder="ws://localhost:8000/ws"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-neutral-400">Auth Token (optional)</span>
            <input
              type="password"
              value={settings.connection.token}
              onChange={(e) => updateConnection({ token: e.target.value })}
              placeholder="Bearer token"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs text-neutral-400">Transport</span>
            <select
              value={settings.connection.transport}
              onChange={(e) =>
                updateConnection({ transport: e.target.value as "http" | "websocket" | "sse" })
              }
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm focus:border-blue-600 focus:outline-none"
            >
              <option value="http">HTTP (REST)</option>
              <option value="websocket">WebSocket</option>
              <option value="sse">SSE (Server-Sent Events)</option>
            </select>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={testConnection}
              disabled={connectionStatus === "connecting"}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-opacity"
            >
              {connectionStatus === "connecting" ? "Testing…" : "Test Connection"}
            </button>
            <span className="text-sm text-neutral-400">
              {STATUS_LABELS[connectionStatus] ?? "⚪ Unknown"}
            </span>
          </div>
        </section>

        {/* Editor */}
        <section className="rounded-2xl border border-neutral-800 p-4 space-y-4">
          <h2 className="text-sm font-medium">Editor</h2>

          <label className="block space-y-1">
            <span className="text-xs text-neutral-400">Font Size</span>
            <input
              type="number"
              min={10}
              max={32}
              value={settings.editor.fontSize}
              onChange={(e) => updateEditor({ fontSize: Number(e.target.value) })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </label>

          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={settings.editor.wordWrap}
              onChange={(e) => updateEditor({ wordWrap: e.target.checked })}
              className="accent-blue-600"
            />
            Word Wrap
          </label>

          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={settings.editor.minimap}
              onChange={(e) => updateEditor({ minimap: e.target.checked })}
              className="accent-blue-600"
            />
            Minimap
          </label>

          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={settings.editor.autoSave}
              onChange={(e) => updateEditor({ autoSave: e.target.checked })}
              className="accent-blue-600"
            />
            Auto Save
          </label>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-neutral-800 p-4 space-y-4">
          <h2 className="text-sm font-medium">Appearance</h2>
          <label className="block space-y-1">
            <span className="text-xs text-neutral-400">Theme</span>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as "dark" | "light" | "system" })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm focus:border-blue-600 focus:outline-none"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </label>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => useSettingsStore.getState().applyConnectionToAgent()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm text-white hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Apply Settings
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
