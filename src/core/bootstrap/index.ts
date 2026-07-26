import { registerEventHandlers } from "./registerEventHandlers";
import { connectApplication } from "./connectApplication";
import { registerAgents } from "../../bootstrap/registerAgents";
import { eventBus } from "../events/EventBus";

export async function bootstrapApplication() {
  // 1. Register all available agent adapters (sets the active one)
  registerAgents();

  // 2. Wire global event handlers to feature stores
  registerEventHandlers();

  // 3. Restore saved settings and connect
  await connectApplication();

  // 4. Signal ready
  await eventBus.emit("app:ready", {
    timestamp: new Date().toISOString(),
  }).catch(() => {});
}
