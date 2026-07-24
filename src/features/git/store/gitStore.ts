import { create } from "zustand";
import type {
  GitBranch,
  GitCommit,
  GitFile,
} from "../types";

type GitState = {
  currentBranch: string;

  files: GitFile[];

  commits: GitCommit[];

  commitMessage: string;

  setCommitMessage: (
    value: string,
  ) => void;

  stageFile: (
    fileId: string,
  ) => void;

  unstageFile: (
    fileId: string,
  ) => void;

  stageAll: () => void;

  unstageAll: () => void;

  commit: () => void;
};

function createId() {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function now() {
  return new Date().toISOString();
}

export const useGitStore =
  create<GitState>((set, get) => ({
    currentBranch: "main",

    commitMessage: "",

    files: [
      {
        id: createId(),
        path: "src/App.tsx",
        status: "modified",
        staged: false,
      },
      {
        id: createId(),
        path:
          "src/features/chat/ChatPanel.tsx",
        status: "added",
        staged: false,
      },
    ],

    commits: [
      {
        id: createId(),
        hash: "a1b2c3d",
        message:
          "Initialize workspace",
        author: "User",
        createdAt: now(),
      },
    ],

    setCommitMessage: (
      value,
    ) => {
      set({
        commitMessage: value,
      });
    },

    stageFile: (fileId) => {
      set((state) => ({
        files: state.files.map(
          (file) =>
            file.id === fileId
              ? {
                  ...file,
                  staged: true,
                }
              : file,
        ),
      }));
    },

    unstageFile: (
      fileId,
    ) => {
      set((state) => ({
        files: state.files.map(
          (file) =>
            file.id === fileId
              ? {
                  ...file,
                  staged: false,
                }
              : file,
        ),
      }));
    },

    stageAll: () => {
      set((state) => ({
        files: state.files.map(
          (file) => ({
            ...file,
            staged: true,
          }),
        ),
      }));
    },

    unstageAll: () => {
      set((state) => ({
        files: state.files.map(
          (file) => ({
            ...file,
            staged: false,
          }),
        ),
      }));
    },

    commit: () => {
      const state = get();

      const message =
        state.commitMessage.trim();

      if (!message) return;

      const stagedFiles =
        state.files.filter(
          (file) => file.staged,
        );

      if (
        stagedFiles.length === 0
      )
        return;

      const commit: GitCommit = {
        id: createId(),
        hash: Math.random()
          .toString(16)
          .substring(2, 9),
        message,
        author: "User",
        createdAt: now(),
      };

      set({
        commitMessage: "",

        commits: [
          commit,
          ...state.commits,
        ],

        files:
          state.files.filter(
            (file) =>
              !file.staged,
          ),
      });
    },
  }));
