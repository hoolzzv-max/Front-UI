import type { AgentAdapter } from "../AgentAdapter";

export class AgentRegistry {
  private adapters = new Map<string, AgentAdapter>();
  private activeId: string | null = null;

  register(adapter: AgentAdapter): void {
    this.adapters.set(adapter.id, adapter);
    if (this.activeId === null) {
      this.activeId = adapter.id;
    }
  }

  unregister(id: string): void {
    this.adapters.delete(id);
    if (this.activeId === id) {
      this.activeId = this.adapters.size > 0
        ? this.adapters.keys().next().value ?? null
        : null;
    }
  }

  getActive(): AgentAdapter | null {
    if (!this.activeId) return null;
    return this.adapters.get(this.activeId) ?? null;
  }

  setActive(id: string): boolean {
    if (!this.adapters.has(id)) return false;
    this.activeId = id;
    return true;
  }

  getActiveId(): string | null {
    return this.activeId;
  }

  list(): AgentAdapter[] {
    return Array.from(this.adapters.values());
  }

  has(id: string): boolean {
    return this.adapters.has(id);
  }
}

export const agentRegistry = new AgentRegistry();
