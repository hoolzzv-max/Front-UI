import type { WorkspaceFile } from "../../../types/file";

export type ExplorerNodeType = "file" | "directory";

export type FileTreeNode = WorkspaceFile & {
  type: ExplorerNodeType;
  children?: FileTreeNode[];
};

export type FlatFileTreeNode = FileTreeNode & {
  depth: number;
  isExpanded: boolean;
};

export type CreateNodeInput = {
  name: string;
  parentPath?: string | null;
  content?: string;
};

export type RenameNodeInput = {
  path: string;
  nextName: string;
};
