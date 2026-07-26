import { agentRegistry } from "@/agents/core/AgentRegistry";
import { agentService } from "@/agents/core/AgentService";
import { currentAgentAdapter } from "@/agents/adapters/current";
import { mockAgentAdapter } from "@/agents/adapters/mock";

export function registerAgents(): void {
  agentRegistry.register(currentAgentAdapter);
  agentRegistry.register(mockAgentAdapter);
  const active = agentRegistry.getActive();
  if (active) { agentService.setAdapter(active); }
}

export function switchAgent(adapterId: string): boolean {
  const ok = agentRegistry.setActive(adapterId);
  if (ok) {
    const active = agentRegistry.getActive();
    if (active) { agentService.setAdapter(active); }
  }
  return ok;
}
