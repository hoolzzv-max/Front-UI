import { useEditorStore } from "../store/editorStore";

export function useEditor() {
  return useEditorStore();
}
