import {
  GitBranch,
  Upload,
  Download,
  CheckCircle2,
} from "lucide-react";

import { useGit } from "../hooks/useGit";

export function GitPanel() {
  const {
    currentBranch,
    files,
    commits,
    commitMessage,
    setCommitMessage,
    stageFile,
    unstageFile,
    stageAll,
    unstageAll,
    commit,
  } = useGit();

  return (
    <div className="flex h-full flex-col bg-neutral-950">
      <div className="border-b border-neutral-800 p-3">
        <div className="flex items-center gap-2 text-sm">
          <GitBranch size={16} />
          {currentBranch}
        </div>
      </div>

      <div className="border-b border-neutral-800 p-3">
        <textarea
          value={commitMessage}
          onChange={(e) =>
            setCommitMessage(
              e.target.value,
            )
          }
          placeholder="Commit message..."
          className="h-20 w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 p-2 text-sm text-neutral-100 outline-none"
        />

        <div className="mt-2 flex gap-2">
          <button
            onClick={commit}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs text-white"
          >
            Commit
          </button>

          <button
            onClick={stageAll}
            className="rounded-lg border border-neutral-800 px-3 py-2 text-xs"
          >
            Stage All
          </button>

          <button
            onClick={unstageAll}
            className="rounded-lg border border-neutral-800 px-3 py-2 text-xs"
          >
            Unstage All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-3">
          <div className="mb-2 text-xs text-neutral-500">
            Changed Files
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className="mb-2 rounded-xl border border-neutral-800 bg-neutral-900 p-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm">
                    {file.path}
                  </div>

                  <div className="text-xs text-neutral-500">
                    {file.status}
                  </div>
                </div>

                {file.staged ? (
                  <button
                    onClick={() =>
                      unstageFile(
                        file.id,
                      )
                    }
                    className="rounded-lg p-1"
                  >
                    <Download
                      size={14}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      stageFile(
                        file.id,
                      )
                    }
                    className="rounded-lg p-1"
                  >
                    <Upload
                      size={14}
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-800 p-3">
          <div className="mb-2 text-xs text-neutral-500">
            Commit History
          </div>

          {commits.map((commit) => (
            <div
              key={commit.id}
              className="mb-2 rounded-xl border border-neutral-800 bg-neutral-900 p-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  size={14}
                />

                {commit.message}
              </div>

              <div className="mt-1 text-xs text-neutral-500">
                {commit.hash}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
