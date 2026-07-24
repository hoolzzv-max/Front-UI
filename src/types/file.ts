export type FileType =
  | "file"
  | "directory";

export interface WorkspaceFile {
  id: string;

  name: string;

  path: string;

  type: FileType;

  extension?: string;

  content?: string;

  size?: number;

  createdAt?: string;

  updatedAt?: string;
}
