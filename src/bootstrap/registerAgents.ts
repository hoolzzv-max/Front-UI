// ============================================================
// registerAgents — called once at app startup.
// This is the ONLY place that imports specific adapter classes.
// ============================================================

import { agentRegistry } from "../agents/core/registry";
import { CurrentAgentAdapter } from "../agents/adapters/current";
import { MockAgentAdapter } from "../agents/adapters/mock";

const IS_DEV = import.meta.env.DEV;

export function registerAgents(): void {
  // Always register the mock adapter (available for testing)
  agentRegistry.register(new MockAgentAdapter());

  // Register the real adapter — it becomes active if registered last
  // (registry sets activeId to the first registered; we override below)
  agentRegistry.register(new CurrentAgentAdapter());

  // Prefer real adapter in production; fall back to mock in dev if no URL configured
  const apiUrl = import.meta.env.VITE_AGENT_API_URL ?? "";
  if (IS_DEV && !apiUrl) {
    agentRegistry.setActive("mock");
  } else {
    agentRegistry.setActive("current");
  }
}
