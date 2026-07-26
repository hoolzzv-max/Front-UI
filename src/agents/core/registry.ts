// ============================================================
// AgentRegistry — stores adapters and exposes the active one.
// Only ONE adapter is active at any time (single-agent session).
// ============================================================

import type { IAgentAdapter } from "./adapter";

class AgentRegistry {
  private readonly adapters = new Map<string, IAgentAdapter>();
  private activeId: string | null = null;

  register(adapter: IAgentAdapter): void {
    this.adapters.set(adapter.id, adapter);
    if (this.activeId === null) {
      this.activeId = adapter.id;
    }
  }

  setActive(id: string): void {
    if (!this.adapters.has(id)) {
      throw new Error(`AgentRegistry: adapter "${id}" is not registered.`);
    }
    this.activeId = id;
  }

  getActive(): IAgentAdapter {
    if (!this.activeId) {
      throw new Error("AgentRegistry: no active adapter. Register at least one adapter before use.");
    }
    const adapter = this.adapters.get(this.activeId);
    if (!adapter) {
      throw new Error(`AgentRegistry: active adapter "${this.activeId}" not found.`);
    }
    return adapter;
  }

  listIds(): string[] {
    return Array.from(this.adapters.keys());
  }

  hasAdapter(id: string): boolean {
    return this.adapters.has(id);
  }

  getActiveId(): string | null {
    return this.activeId;
  }
}

export const agentRegistry = new AgentRegistry();
