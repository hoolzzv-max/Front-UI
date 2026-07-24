import { registerEventHandlers } from "./registerEventHandlers";
import { connectApplication } from "./connectApplication";

let bootstrapped = false;

export async function bootstrapApplication() {
  if (bootstrapped) {
    return;
  }

  bootstrapped = true;

  registerEventHandlers();

  await connectApplication();
}
