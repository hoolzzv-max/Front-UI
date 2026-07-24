import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus2,
  Folder,
  FolderPlus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useFiles } from "../hooks/useFiles";
import type { FlatFileTreeNode } from "../types";

type FileExplorerProps = {
  onOpenFile?: () => void;
};

type DraftAction =
  | {
      type: "create-file";
      parentPath: string | null;
      value: string;
    }
  | {
      type: "create-folder";
      parentPath: string | null;
      value: string;
    }
  | {
      type: "rename";
      path: string;
      value: string;
    }
  | null;

function getParentForNewNode(selectedNode: FlatFileTreeNode | null) {
  if (!selectedNode) return null;

  if (selectedNode.type === "directory") return selectedNode.path;

  const parts = selectedNode.path.split("/");

  if (parts.length <= 1) return null;

  return parts.slice(0, -1).join("/");
}

function TreeRow({
  node,
  selected,
  isRenaming,
  renameValue,
  onRenameChange,
  onRenameConfirm,
  onRenameCancel,
  onSelect,
  onToggle,
  onOpen,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
}: {
  node: FlatFileTreeNode;
  selected: boolean;
  isRenaming: boolean;
  renameValue: string;
  onRenameChange: (value: string) => void;
  onRenameConfirm: () => void;
  onRenameCancel: () => void;
  onSelect: () => void;
  onToggle: () => void;
  onOpen: () => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const isDirectory = node.type === "directory";

  return (
    <div
      className={[
        "group flex h-8 items-center gap-1 rounded-lg pr-1 text-sm",
        selected
          ? "bg-blue-500/10 text-blue-300"
          : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100",
      ].join(" ")}
      style={{ paddingLeft: 8 + node.depth * 14 }}
      onClick={onSelect}
      onDoubleClick={isDirectory ? onToggle : onOpen}
      role="button"
      tabIndex={0}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (isDirectory) onToggle();
        }}
        className="flex h-6 w-5 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
        aria-label={isDirectory ? "Toggle directory" : "File"}
      >
        {isDirectory ? (
          node.isExpanded ? (
            <ChevronDown size={15} />
          ) : (
            <ChevronRight size={15} />
          )
        ) : (
          <span className="h-4 w-4" />
        )}
      </button>

      <div className="flex h-6 w-5 shrink-0 items-center justify-center">
        {isDirectory ? (
          <Folder size={16} className="text-blue-400" />
        ) : (
          <File size={16} className="text-neutral-500" />
        )}
      </div>

      {isRenaming ? (
        <form
          className="flex min-w-0 flex-1 items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault();
            onRenameConfirm();
          }}
        >
          <input
            autoFocus
            value={renameValue}
            onChange={(event) => onRenameChange(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") onRenameCancel();
            }}
            className="h-6 min-w-0 flex-1 rounded-md border border-blue-500 bg-neutral-950 px-2 text-xs text-neutral-100 outline-none"
          />

          <button
            type="submit"
            className="rounded-md p-1 text-emerald-400 hover:bg-neutral-800"
          >
            <Check size={13} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onRenameCancel();
            }}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
          >
            <X size={13} />
          </button>
        </form>
      ) : (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              isDirectory ? onToggle() : onOpen();
            }}
            className="min-w-0 flex-1 truncate text-left"
            title={node.path}
          >
            {node.name}
          </button>

          <div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
            {isDirectory && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCreateFile();
                  }}
                  className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
                  title="New file"
                >
                  <FilePlus2 size={13} />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCreateFolder();
                  }}
                  className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
                  title="New folder"
                >
                  <FolderPlus size={13} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRename();
              }}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
              title="Rename"
            >
              <Pencil size={13} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="rounded-md p-1 text-neutral-500 hover:bg-red-500/10 hover:text-red-300"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function FileExplorer({ onOpenFile }: FileExplorerProps) {
  const {
    selectedPath,
    getNode,
    getFlatTree,
    selectPath,
    toggleDirectory,
    expandDirectory,
    openFile,
    createFile,
    createFolder,
    renameNode,
    deleteNode,
  } = useFiles();

  const [draft, setDraft] = useState<DraftAction>(null);

  const flatTree = getFlatTree();

  const selectedNode = useMemo(() => {
    if (!selectedPath) return null;

    return getNode(selectedPath) as FlatFileTreeNode | null;
  }, [getNode, selectedPath]);

  const confirmDraft = () => {
    if (!draft) return;

    const value = draft.value.trim();

    if (!value) {
      setDraft(null);
      return;
    }

    if (draft.type === "create-file") {
      createFile({
        name: value,
        parentPath: draft.parentPath,
      });

      if (draft.parentPath) expandDirectory(draft.parentPath);
    }

    if (draft.type === "create-folder") {
      createFolder({
        name: value,
        parentPath: draft.parentPath,
      });

      if (draft.parentPath) expandDirectory(draft.parentPath);
    }

    if (draft.type === "rename") {
      renameNode({
        path: draft.path,
        nextName: value,
      });
    }

    setDraft(null);
  };

  const startCreateFile = (parentPath?: string | null) => {
    setDraft({
      type: "create-file",
      parentPath: parentPath ?? getParentForNewNode(selectedNode),
      value: "new-file.ts",
    });
  };

  const startCreateFolder = (parentPath?: string | null) => {
    setDraft({
      type: "create-folder",
      parentPath: parentPath ?? getParentForNewNode(selectedNode),
      value: "new-folder",
    });
  };

  const rootDraftVisible =
    draft &&
    (draft.type === "create-file" || draft.type === "create-folder") &&
    !draft.parentPath;

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-950">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 px-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Explorer
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => startCreateFile()}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
            title="New file"
          >
            <FilePlus2 size={15} />
          </button>

          <button
            type="button"
            onClick={() => startCreateFolder()}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
            title="New folder"
          >
            <FolderPlus size={15} />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-auto p-2">
        {rootDraftVisible && (
          <form
            className="mb-1 flex h-8 items-center gap-1 rounded-lg bg-neutral-900 px-2"
            onSubmit={(event) => {
              event.preventDefault();
              confirmDraft();
            }}
          >
            {draft.type === "create-folder" ? (
              <Folder size={16} className="text-blue-400" />
            ) : (
              <File size={16} className="text-neutral-500" />
            )}

            <input
              autoFocus
              value={draft.value}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  value: event.target.value,
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Escape") setDraft(null);
              }}
              className="h-6 min-w-0 flex-1 rounded-md border border-blue-500 bg-neutral-950 px-2 text-xs text-neutral-100 outline-none"
            />

            <button
              type="submit"
              className="rounded-md p-1 text-emerald-400 hover:bg-neutral-800"
            >
              <Check size={13} />
            </button>

            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
            >
              <X size={13} />
            </button>
          </form>
        )}

        {flatTree.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <div>
              <p className="text-sm text-neutral-400">No files</p>
              <p className="mt-1 text-xs text-neutral-600">
                Create your first file or folder.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {flatTree.map((node) => {
              const isRenaming =
                draft?.type === "rename" && draft.path === node.path;

              return (
                <div key={node.path}>
                  <TreeRow
                    node={node}
                    selected={selectedPath === node.path}
                    isRenaming={isRenaming}
                    renameValue={isRenaming ? draft.value : ""}
                    onRenameChange={(value) => {
                      if (draft?.type === "rename") {
                        setDraft({
                          ...draft,
                          value,
                        });
                      }
                    }}
                    onRenameConfirm={confirmDraft}
                    onRenameCancel={() => setDraft(null)}
                    onSelect={() => selectPath(node.path)}
                    onToggle={() => toggleDirectory(node.path)}
                    onOpen={() => {
                      openFile(node.path);
                      onOpenFile?.();
                    }}
                    onCreateFile={() => {
                      expandDirectory(node.path);
                      startCreateFile(node.path);
                    }}
                    onCreateFolder={() => {
                      expandDirectory(node.path);
                      startCreateFolder(node.path);
                    }}
                    onRename={() =>
                      setDraft({
                        type: "rename",
                        path: node.path,
                        value: node.name,
                      })
                    }
                    onDelete={() => deleteNode(node.path)}
                  />

                  {draft &&
                    (draft.type === "create-file" ||
                      draft.type === "create-folder") &&
                    draft.parentPath === node.path && (
                      <form
                        className="mt-0.5 flex h-8 items-center gap-1 rounded-lg bg-neutral-900 pr-2"
                        style={{ paddingLeft: 28 + (node.depth + 1) * 14 }}
                        onSubmit={(event) => {
                          event.preventDefault();
                          confirmDraft();
                        }}
                      >
                        {draft.type === "create-folder" ? (
                          <Folder size={16} className="text-blue-400" />
                        ) : (
                          <File size={16} className="text-neutral-500" />
                        )}

                        <input
                          autoFocus
                          value={draft.value}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              value: event.target.value,
                            })
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Escape") setDraft(null);
                          }}
                          className="h-6 min-w-0 flex-1 rounded-md border border-blue-500 bg-neutral-950 px-2 text-xs text-neutral-100 outline-none"
                        />

                        <button
                          type="submit"
                          className="rounded-md p-1 text-emerald-400 hover:bg-neutral-800"
                        >
                          <Check size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDraft(null)}
                          className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
                        >
                          <X size={13} />
                        </button>
                      </form>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
