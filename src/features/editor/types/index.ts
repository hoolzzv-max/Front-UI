import type { WorkspaceFile } from "../../../types/file";

export type EditorLanguage =
  | "typescript"
  | "javascript"
  | "json"
  | "css"
  | "html"
  | "markdown"
  | "python"
  | "shell"
  | "plaintext";

export type EditorTab = {
  path: string;
  name: string;
  language: EditorLanguage;
  dirty: boolean;
};

export type EditorFile = WorkspaceFile & {
  type: "file";
  content: string;
  language?: EditorLanguage;
};

export type EditorOpenOptions = {
  focus?: boolean;
};
