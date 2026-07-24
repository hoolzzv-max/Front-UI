export type GitFileStatus =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "untracked";

export interface GitFile {
  id: string;
  path: string;
  status: GitFileStatus;
  staged: boolean;
}

export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface GitBranch {
  name: string;
  current: boolean;
}
