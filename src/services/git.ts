// Git service — delegates git operations to the feature store.
// When the active agent adapter supports git, it will be routed here.
import { FEATURE_FLAGS } from "../config/features";

export interface GitServiceResult {
  success: boolean;
  message?: string;
}

class GitService {
  isSupported(): boolean {
    return FEATURE_FLAGS.git;
  }

  async getStatus(): Promise<GitServiceResult> {
    if (!this.isSupported()) {
      return { success: false, message: "Git feature is not enabled." };
    }
    // TODO: Route through agent adapter when agentFileSystem is enabled
    return { success: true };
  }
}

export const gitService = new GitService();
