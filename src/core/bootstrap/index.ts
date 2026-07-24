import { registerEventHandlers } from "./registerEventHandlers";

let bootstrapped = false;

export function bootstrapApplication() {
  if (bootstrapped) {
    return;
  }

  bootstrapped = true;

  registerEventHandlers();
}
