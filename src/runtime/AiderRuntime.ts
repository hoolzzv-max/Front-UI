import { aiderService } from "../services/aider";

export class AiderRuntime {
  async prompt(
    message: string,
  ) {
    return aiderService.sendPrompt({
      prompt: message,
    });
  }

  async healthCheck() {
    return aiderService.getStatus();
  }
}

export const aiderRuntime =
  new AiderRuntime();
