import { useCallback } from "react";
import { useEditorStore, detectLanguage } from "../../editor/store/editorStore";
import { useFileStore } from "../store/fileStore";
import type { FileTreeNode } from "../types";

function toEditorFile(node: FileTreeNode) {
  return {
    id: node.id,
    name: node.name,
    path: node.path,
    type: "file" as const,
    extension: node.extension,
    content: node.content ?? "",
    size: node.size,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
    language: detectLanguage(node.path),
  };
}

export function useFiles() {
  const fileStore = useFileStore();
  const openEditorFile = useEditorStore((state) => state.openFile);

  const openFile = useCallback(
    (path: string) => {
      const node = fileStore.getNode(path);

      if (!node) return;
      if (node.type !== "file") return;

      fileStore.selectPath(path);
      openEditorFile(toEditorFile(node));
    },
    [fileStore, openEditorFile],
  );

  return {
    ...fileStore,
    openFile,
  };
}
