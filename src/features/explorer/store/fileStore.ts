import { create } from "zustand";
import type {
  CreateNodeInput,
  FileTreeNode,
  FlatFileTreeNode,
  RenameNodeInput,
} from "../types";

type FileStoreState = {
  tree: FileTreeNode[];
  selectedPath: string | null;
  expandedPaths: string[];

  setTree: (tree: FileTreeNode[]) => void;

  selectPath: (path: string | null) => void;
  toggleDirectory: (path: string) => void;
  expandDirectory: (path: string) => void;
  collapseDirectory: (path: string) => void;

  createFile: (input: CreateNodeInput) => void;
  createFolder: (input: CreateNodeInput) => void;
  renameNode: (input: RenameNodeInput) => void;
  deleteNode: (path: string) => void;

  updateFileContent: (path: string, content: string) => void;

  getNode: (path: string) => FileTreeNode | null;
  getFlatTree: () => FlatFileTreeNode[];
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

function normalizeName(name: string) {
  return name.trim().replaceAll("\\", "/").split("/").filter(Boolean).at(-1) ?? "";
}

function getExtension(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() : undefined;
}

function joinPath(parentPath: string | null | undefined, name: string) {
  const safeName = normalizeName(name);

  if (!parentPath) return safeName;

  return `${parentPath.replace(/\/$/, "")}/${safeName}`;
}

function getParentPath(path: string) {
  const parts = path.split("/");

  if (parts.length <= 1) return null;

  return parts.slice(0, -1).join("/");
}

function sortNodes(nodes: FileTreeNode[]) {
  return [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;

    return a.name.localeCompare(b.name);
  });
}

function findNode(nodes: FileTreeNode[], path: string): FileTreeNode | null {
  for (const node of nodes) {
    if (node.path === path) return node;

    if (node.children) {
      const found = findNode(node.children, path);

      if (found) return found;
    }
  }

  return null;
}

function siblingExists(
  nodes: FileTreeNode[],
  parentPath: string | null | undefined,
  name: string,
) {
  const safeName = normalizeName(name);

  if (!parentPath) {
    return nodes.some((node) => node.name === safeName);
  }

  const parent = findNode(nodes, parentPath);

  if (!parent || parent.type !== "directory") return false;

  return (parent.children ?? []).some((node) => node.name === safeName);
}

function insertNode(
  nodes: FileTreeNode[],
  parentPath: string | null | undefined,
  node: FileTreeNode,
): FileTreeNode[] {
  if (!parentPath) {
    return sortNodes([...nodes, node]);
  }

  return nodes.map((item) => {
    if (item.path !== parentPath) {
      return {
        ...item,
        children: item.children
          ? insertNode(item.children, parentPath, node)
          : item.children,
      };
    }

    return {
      ...item,
      children: sortNodes([...(item.children ?? []), node]),
      updatedAt: now(),
    };
  });
}

function removeNode(nodes: FileTreeNode[], path: string): FileTreeNode[] {
  return nodes
    .filter((node) => node.path !== path)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, path) : node.children,
    }));
}

function replaceNode(
  nodes: FileTreeNode[],
  path: string,
  updater: (node: FileTreeNode) => FileTreeNode,
): FileTreeNode[] {
  return nodes.map((node) => {
    if (node.path === path) return updater(node);

    return {
      ...node,
      children: node.children ? replaceNode(node.children, path, updater) : node.children,
    };
  });
}

function updateChildPaths(
  node: FileTreeNode,
  oldBasePath: string,
  newBasePath: string,
): FileTreeNode {
  const nextPath =
    node.path === oldBasePath
      ? newBasePath
      : node.path.startsWith(`${oldBasePath}/`)
        ? node.path.replace(oldBasePath, newBasePath)
        : node.path;

  return {
    ...node,
    path: nextPath,
    children: node.children
      ? node.children.map((child) => updateChildPaths(child, oldBasePath, newBasePath))
      : node.children,
  };
}

function flattenTree(
  nodes: FileTreeNode[],
  expandedPaths: string[],
  depth = 0,
): FlatFileTreeNode[] {
  const result: FlatFileTreeNode[] = [];

  for (const node of sortNodes(nodes)) {
    const isExpanded = expandedPaths.includes(node.path);

    result.push({
      ...node,
      depth,
      isExpanded,
    });

    if (node.type === "directory" && isExpanded && node.children) {
      result.push(...flattenTree(node.children, expandedPaths, depth + 1));
    }
  }

  return result;
}

const initialTree: FileTreeNode[] = [
  {
    id: createId(),
    name: "src",
    path: "src",
    type: "directory",
    createdAt: now(),
    children: [
      {
        id: createId(),
        name: "App.tsx",
        path: "src/App.tsx",
        type: "file",
        extension: "tsx",
        content:
          'import { AppProviders } from "./providers/AppProviders";\nimport { DesktopLayout } from "./layouts/DesktopLayout";\n\nexport default function App() {\n  return (\n    <AppProviders>\n      <DesktopLayout />\n    </AppProviders>\n  );\n}\n',
        createdAt: now(),
      },
      {
        id: createId(),
        name: "main.tsx",
        path: "src/main.tsx",
        type: "file",
        extension: "tsx",
        content:
          'import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nimport "./index.css";\n\nReactDOM.createRoot(document.getElementById("root")!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);\n',
        createdAt: now(),
      },
    ],
  },
  {
    id: createId(),
    name: "package.json",
    path: "package.json",
    type: "file",
    extension: "json",
    content:
      '{\n  "name": "frontend-ui",\n  "version": "1.0.0",\n  "private": true\n}\n',
    createdAt: now(),
  },
  {
    id: createId(),
    name: "README.md",
    path: "README.md",
    type: "file",
    extension: "md",
    content:
      "# AI Development Workspace\n\nProfessional frontend workspace for AI-assisted development.\n",
    createdAt: now(),
  },
];

export const useFileStore = create<FileStoreState>((set, get) => ({
  tree: initialTree,
  selectedPath: null,
  expandedPaths: ["src"],

  setTree: (tree) => {
    set({
      tree: sortNodes(tree),
      selectedPath: null,
      expandedPaths: [],
    });
  },

  selectPath: (path) => {
    set({
      selectedPath: path,
    });
  },

  toggleDirectory: (path) => {
    const node = get().getNode(path);

    if (!node || node.type !== "directory") return;

    set((state) => ({
      expandedPaths: state.expandedPaths.includes(path)
        ? state.expandedPaths.filter((item) => item !== path)
        : [...state.expandedPaths, path],
    }));
  },

  expandDirectory: (path) => {
    set((state) => ({
      expandedPaths: state.expandedPaths.includes(path)
        ? state.expandedPaths
        : [...state.expandedPaths, path],
    }));
  },

  collapseDirectory: (path) => {
    set((state) => ({
      expandedPaths: state.expandedPaths.filter((item) => item !== path),
    }));
  },

  createFile: ({ name, parentPath = null, content = "" }) => {
    const safeName = normalizeName(name);

    if (!safeName) return;

    set((state) => {
      if (siblingExists(state.tree, parentPath, safeName)) return state;

      const path = joinPath(parentPath, safeName);

      const file: FileTreeNode = {
        id: createId(),
        name: safeName,
        path,
        type: "file",
        extension: getExtension(safeName),
        content,
        createdAt: now(),
      };

      return {
        tree: insertNode(state.tree, parentPath, file),
        selectedPath: path,
      };
    });
  },

  createFolder: ({ name, parentPath = null }) => {
    const safeName = normalizeName(name);

    if (!safeName) return;

    set((state) => {
      if (siblingExists(state.tree, parentPath, safeName)) return state;

      const path = joinPath(parentPath, safeName);

      const folder: FileTreeNode = {
        id: createId(),
        name: safeName,
        path,
        type: "directory",
        children: [],
        createdAt: now(),
      };

      return {
        tree: insertNode(state.tree, parentPath, folder),
        selectedPath: path,
        expandedPaths: parentPath
          ? state.expandedPaths.includes(parentPath)
            ? state.expandedPaths
            : [...state.expandedPaths, parentPath]
          : state.expandedPaths,
      };
    });
  },

  renameNode: ({ path, nextName }) => {
    const safeName = normalizeName(nextName);

    if (!safeName) return;

    set((state) => {
      const node = findNode(state.tree, path);

      if (!node) return state;

      const parentPath = getParentPath(path);

      if (siblingExists(removeNode(state.tree, path), parentPath, safeName)) {
        return state;
      }

      const nextPath = joinPath(parentPath, safeName);

      const nextTree = replaceNode(state.tree, path, (currentNode) => {
        const updatedNode = updateChildPaths(currentNode, path, nextPath);

        return {
          ...updatedNode,
          name: safeName,
          extension: updatedNode.type === "file" ? getExtension(safeName) : undefined,
          updatedAt: now(),
        };
      });

      return {
        tree: nextTree,
        selectedPath: state.selectedPath === path ? nextPath : state.selectedPath,
        expandedPaths: state.expandedPaths.map((item) =>
          item === path || item.startsWith(`${path}/`)
            ? item.replace(path, nextPath)
            : item,
        ),
      };
    });
  },

  deleteNode: (path) => {
    set((state) => ({
      tree: removeNode(state.tree, path),
      selectedPath:
        state.selectedPath === path || state.selectedPath?.startsWith(`${path}/`)
          ? null
          : state.selectedPath,
      expandedPaths: state.expandedPaths.filter(
        (item) => item !== path && !item.startsWith(`${path}/`),
      ),
    }));
  },

  updateFileContent: (path, content) => {
    set((state) => ({
      tree: replaceNode(state.tree, path, (node) => {
        if (node.type !== "file") return node;

        return {
          ...node,
          content,
          updatedAt: now(),
        };
      }),
    }));
  },

  getNode: (path) => {
    return findNode(get().tree, path);
  },

  getFlatTree: () => {
    const state = get();

    return flattenTree(state.tree, state.expandedPaths);
  },
}));
