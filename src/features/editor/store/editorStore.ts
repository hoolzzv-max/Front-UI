import { create } from "zustand";
import type { WorkspaceFile } from "../../../types/file";
import type { EditorFile, EditorLanguage, EditorTab } from "../types";

type EditorState = {
  files: EditorFile[];
  openTabs: string[];
  activeFilePath: string | null;
  dirtyFilePaths: string[];

  setFiles: (files: WorkspaceFile[]) => void;

  openFile: (file: EditorFile) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string) => void;

  updateFileContent: (path: string, content: string) => void;
  saveFile: (path: string) => void;
  saveAll: () => void;

  createFile: (params: {
    name: string;
    path: string;
    content?: string;
    language?: EditorLanguage;
  }) => void;

  deleteFile: (path: string) => void;

  getActiveFile: () => EditorFile | null;
  getTabs: () => EditorTab[];
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getExtension(path: string) {
  const parts = path.split(".");
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() : undefined;
}

export function detectLanguage(path: string): EditorLanguage {
  const extension = getExtension(path);

  if (extension === "ts" || extension === "tsx") return "typescript";
  if (extension === "js" || extension === "jsx") return "javascript";
  if (extension === "json") return "json";
  if (extension === "css") return "css";
  if (extension === "html") return "html";
  if (extension === "md" || extension === "mdx") return "markdown";
  if (extension === "py") return "python";
  if (extension === "sh" || extension === "bash") return "shell";

  return "plaintext";
}

function normalizeFile(file: WorkspaceFile): EditorFile | null {
  if (file.type !== "file") return null;

  return {
    ...file,
    type: "file",
    content: file.content ?? "",
    language: detectLanguage(file.path),
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: [
    {
      id: createId(),
      name: "README.md",
      path: "README.md",
      type: "file",
      extension: "md",
      content:
        "# AI Development Workspace\n\nThis editor is ready. Backend file sync is not connected yet.\n",
      language: "markdown",
      createdAt: new Date().toISOString(),
    },
  ],

  openTabs: ["README.md"],
  activeFilePath: "README.md",
  dirtyFilePaths: [],

  setFiles: (files) => {
    const normalizedFiles = files
      .map(normalizeFile)
      .filter((file): file is EditorFile => Boolean(file));

    set((state) => {
      const existingActiveFile =
        state.activeFilePath &&
        normalizedFiles.some((file) => file.path === state.activeFilePath);

      return {
        files: normalizedFiles,
        openTabs: existingActiveFile ? state.openTabs : [],
        activeFilePath: existingActiveFile ? state.activeFilePath : null,
        dirtyFilePaths: [],
      };
    });
  },

  openFile: (file) => {
    set((state) => {
      const exists = state.files.some((item) => item.path === file.path);

      return {
        files: exists
          ? state.files
          : [
              ...state.files,
              {
                ...file,
                language: file.language ?? detectLanguage(file.path),
              },
            ],
        openTabs: state.openTabs.includes(file.path)
          ? state.openTabs
          : [...state.openTabs, file.path],
        activeFilePath: file.path,
      };
    });
  },

  closeFile: (path) => {
    set((state) => {
      const nextTabs = state.openTabs.filter((tabPath) => tabPath !== path);

      let nextActiveFilePath = state.activeFilePath;

      if (state.activeFilePath === path) {
        nextActiveFilePath = nextTabs.at(-1) ?? null;
      }

      return {
        openTabs: nextTabs,
        activeFilePath: nextActiveFilePath,
      };
    });
  },

  setActiveFile: (path) => {
    const fileExists = get().files.some((file) => file.path === path);

    if (!fileExists) return;

    set((state) => ({
      activeFilePath: path,
      openTabs: state.openTabs.includes(path)
        ? state.openTabs
        : [...state.openTabs, path],
    }));
  },

  updateFileContent: (path, content) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.path === path
          ? {
              ...file,
              content,
              updatedAt: new Date().toISOString(),
            }
          : file,
      ),
      dirtyFilePaths: state.dirtyFilePaths.includes(path)
        ? state.dirtyFilePaths
        : [...state.dirtyFilePaths, path],
    }));
  },

  saveFile: (path) => {
    set((state) => ({
      dirtyFilePaths: state.dirtyFilePaths.filter(
        (dirtyPath) => dirtyPath !== path,
      ),
      files: state.files.map((file) =>
        file.path === path
          ? {
              ...file,
              updatedAt: new Date().toISOString(),
            }
          : file,
      ),
    }));
  },

  saveAll: () => {
    set((state) => ({
      dirtyFilePaths: [],
      files: state.files.map((file) => ({
        ...file,
        updatedAt: new Date().toISOString(),
      })),
    }));
  },

  createFile: ({ name, path, content = "", language }) => {
    const newFile: EditorFile = {
      id: createId(),
      name,
      path,
      type: "file",
      extension: getExtension(path),
      content,
      language: language ?? detectLanguage(path),
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const exists = state.files.some((file) => file.path === path);

      if (exists) {
        return {
          openTabs: state.openTabs.includes(path)
            ? state.openTabs
            : [...state.openTabs, path],
          activeFilePath: path,
        };
      }

      return {
        files: [...state.files, newFile],
        openTabs: [...state.openTabs, path],
        activeFilePath: path,
      };
    });
  },

  deleteFile: (path) => {
    set((state) => {
      const nextFiles = state.files.filter((file) => file.path !== path);
      const nextTabs = state.openTabs.filter((tabPath) => tabPath !== path);
      const nextDirtyPaths = state.dirtyFilePaths.filter(
        (dirtyPath) => dirtyPath !== path,
      );

      return {
        files: nextFiles,
        openTabs: nextTabs,
        dirtyFilePaths: nextDirtyPaths,
        activeFilePath:
          state.activeFilePath === path
            ? nextTabs.at(-1) ?? null
            : state.activeFilePath,
      };
    });
  },

  getActiveFile: () => {
    const state = get();

    if (!state.activeFilePath) return null;

    return (
      state.files.find((file) => file.path === state.activeFilePath) ?? null
    );
  },

  getTabs: () => {
    const state = get();

    return state.openTabs
      .map((path) => {
        const file = state.files.find((item) => item.path === path);

        if (!file) return null;

        return {
          path: file.path,
          name: file.name,
          language: file.language ?? detectLanguage(file.path),
          dirty: state.dirtyFilePaths.includes(file.path),
        };
      })
      .filter((tab): tab is EditorTab => Boolean(tab));
  },
}));
