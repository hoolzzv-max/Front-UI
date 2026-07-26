import { Save, RotateCcw } from "lucide-react";

import { useSettingsStore } from "../store/settingsStore";
import { agentRegistry } from "@/agents";
import { switchAgent } from "@/bootstrap/registerAgents";
import type { ThemeMode } from "../types";

export function SettingsPanel() {
  const {
    settings,
    connectionStatus,
    testConnection,
    updateConnection,
    updateEditor,
    updateSettings,
    applyAndConnect,
    reset,
  } = useSettingsStore();

  const availableAgents = agentRegistry.list();
  const activeAgentId = agentRegistry.getActiveId();

  return (
    <div className="h-full overflow-auto bg-neutral-950 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Configure agent connection and editor preferences.
          </p>
        </div>

        {/* Agent Selection */}
        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">Active Agent</h2>
          <select
            value={activeAgentId ?? ""}
            onChange={(event) => switchAgent(event.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none"
          >
            {availableAgents.map((adapter) => (
              <option key={adapter.id} value={adapter.id}>
                {adapter.displayName}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-neutral-500">
            Switch the active agent backend. Features adapt to the agent's capabilities.
          </p>
        </section>

        {/* Connection */}
        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">Connection</h2>
          <div className="space-y-3">
            <label className="block">
              <div className="mb-1.5 text-xs text-neutral-500">API URL</div>
              <input
                value={settings.connection.apiUrl}
                onChange={(e) => updateConnection({ apiUrl: e.target.value })}
                placeholder="http://localhost:8000"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none placeholder:text-neutral-600"
              />
            </label>

            <label className="block">
              <div className="mb-1.5 text-xs text-neutral-500">WebSocket URL</div>
              <input
                value={settings.connection.websocketUrl}
                onChange={(e) => updateConnection({ websocketUrl: e.target.value })}
                placeholder="ws://localhost:8000/ws"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none placeholder:text-neutral-600"
              />
            </label>

            <label className="block">
              <div className="mb-1.5 text-xs text-neutral-500">Auth Token</div>
              <input
                type="password"
                value={settings.connection.token}
                onChange={(e) => updateConnection({ token: e.target.value })}
                placeholder="Optional"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none placeholder:text-neutral-600"
              />
            </label>

            <label className="block">
              <div className="mb-1.5 text-xs text-neutral-500">Transport Type</div>
              <select
                value={settings.connection.transportType}
                onChange={(e) =>
                  updateConnection({
                    transportType: e.target.value as "http" | "websocket" | "sse",
                  })
                }
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none"
              >
                <option value="http">HTTP</option>
                <option value="websocket">WebSocket</option>
                <option value="sse">SSE</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void testConnection()}
              disabled={connectionStatus === "connecting"}
              className="rounded-xl bg-neutral-800 px-4 py-2 text-sm text-neutral-100 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {connectionStatus === "connecting" ? "Testing..." : "Test Connection"}
            </button>
            <span className="text-sm text-neutral-400">
              {connectionStatus === "idle" && "Not tested"}
              {connectionStatus === "connecting" && "Connecting..."}
              {connectionStatus === "connected" && "Connected"}
              {connectionStatus === "failed" && "Failed"}
            </span>
          </div>
        </section>

        {/* Editor */}
        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">Editor</h2>
          <div className="space-y-4">
            <label className="block">
              <div className="mb-2 text-sm">Font Size</div>
              <input
                type="number"
                min={10}
                max={32}
                value={settings.editor.fontSize}
                onChange={(e) => updateEditor({ fontSize: Number(e.target.value) })}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none"
              />
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.editor.wordWrap}
                onChange={(e) => updateEditor({ wordWrap: e.target.checked })}
              />
              Word Wrap
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.editor.minimap}
                onChange={(e) => updateEditor({ minimap: e.target.checked })}
              />
              Minimap
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.editor.autoSave}
                onChange={(e) => updateEditor({ autoSave: e.target.checked })}
              />
              Auto Save
            </label>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-neutral-800 p-4">
          <h2 className="mb-4 text-sm font-medium">Appearance</h2>
          <select
            value={settings.theme}
            onChange={(e) => updateSettings({ theme: e.target.value as ThemeMode })}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-neutral-100 outline-none"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void applyAndConnect()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-500"
          >
            <Save size={16} />
            Save & Connect
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 px-4 py-3 text-neutral-400 transition hover:text-neutral-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
