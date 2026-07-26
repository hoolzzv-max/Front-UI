import { registerEventHandlers } from "./registerEventHandlers";
import { connectApplication } from "./connectApplication";
import { registerAgents } from "@/bootstrap/registerAgents";

let bootstrapped = false;

export async function bootstrapApplication() {
  if (bootstrapped) { return; }
  registerEventHandlers();
  registerAgents();
  try { await connectApplication(); } finally { bootstrapped = true; }
}
