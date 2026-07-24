import { useGitStore } from "../features/git/store/gitStore";

export class GitService {
  getCurrentBranch() {
    return useGitStore.getState()
      .currentBranch;
  }

  stageAll() {
    useGitStore
      .getState()
      .stageAll();
  }

  unstageAll() {
    useGitStore
      .getState()
      .unstageAll();
  }

  commit(message: string) {
    const store =
      useGitStore.getState();

    store.setCommitMessage(
      message,
    );

    store.commit();
  }
}

export const gitService =
  new GitService();
