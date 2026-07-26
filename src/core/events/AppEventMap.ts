import type { WorkspaceEventMap } from "../events/EventBus";
import type { AgentEventMap } from "@/agents/core/AgentEvents";

export type AppEventMap = WorkspaceEventMap & AgentEventMap;
