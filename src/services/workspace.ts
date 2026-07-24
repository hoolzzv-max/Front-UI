export interface WorkspaceInfo {
  name: string;

  rootPath: string;

  openedAt: string;
}

export class WorkspaceService {
  private workspace: WorkspaceInfo = {
    name: "AI Workspace",
    rootPath: "/workspace",
    openedAt:
      new Date().toISOString(),
  };

  getWorkspace() {
    return this.workspace;
  }

  rename(name: string) {
    this.workspace = {
      ...this.workspace,
      name,
    };
  }

  setRootPath(path: string) {
    this.workspace = {
      ...this.workspace,
      rootPath: path,
    };
  }
}

export const workspaceService =
  new WorkspaceService();
