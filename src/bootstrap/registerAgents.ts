// ============================================================
// registerAgents — called once at app startup (bootstrap).
// This is the ONLY file that imports specific adapter classes.
//
// Active adapter selection at boot:
//   - Always register both adapters.
//   - Start with "mock" as the safe default.
//   - connectApplication() will switch to "current" when a real
//     agentUrl is found in saved settings or env vars.
// ============================================================

import { agentRegistry } from "../agents/core/registry";
import { CurrentAgentAdapter } from "../agents/adapters/current";
import { MockAgentAdapter } from "../agents/adapters/mock";

export function registerAgents(): void {
  // Register mock first so it becomes the initial default
  agentRegistry.register(new MockAgentAdapter());

  // Register real adapter (does NOT become active — mock stays active by default)
  agentRegistry.register(new CurrentAgentAdapter());

  // If an API URL is present in the environment at boot time, activate "current"
  // immediately so we don't start in mock mode unnecessarily.
  // connectApplication() will also do this from saved settings after this call.
  const envApiUrl = (import.meta.env.VITE_AGENT_API_URL ?? "").trim();
  if (envApiUrl) {
    agentRegistry.setActive("current");
  }
  // else: mock stays active; connectApplication() may switch later
}
