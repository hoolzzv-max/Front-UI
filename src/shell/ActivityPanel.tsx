import { FileExplorer } from "../features/explorer/components/FileExplorer";
import { TasksPanel } from "../features/tasks/components/TasksPanel";
import type { SidebarActivity } from "./Sidebar";

export type WorkspaceView =
  | "chat"
  | "editor"
  | "diff";

type ActivityPanelProps = {
  activeActivity: SidebarActivity;
  onWorkspaceViewChange: (
    view: WorkspaceView,
  ) => void;
};

function SearchPanel() {
  return (
    <div className="p-3">
      <div className="space-y-3">
        <input
          placeholder="Search files, commands, logs..."
          className="h-9 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-blue-500"
        />

        <p className="text-xs leading-6 text-neutral-500">
          Search integration will be
          connected later.
        </p>
      </div>
    </div>
  );
}

function GitPanelPlaceholder() {
  return (
    <div className="p-3">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
        <h3 className="text-sm font-medium text-neutral-200">
          Repository
        </h3>

        <p className="mt-2 text-xs leading-6 text-neutral-500">
          Git feature has not been
          connected yet.
        </p>
      </div>
    </div>
  );
}

export function ActivityPanel({
  activeActivity,
  onWorkspaceViewChange,
}: ActivityPanelProps) {
  const titleMap: Record<
    SidebarActivity,
    string
  > = {
    explorer: "Explorer",
    search: "Search",
    git: "Source Control",
    tasks: "Tasks",
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-neutral-800 bg-neutral-950 md:flex md:flex-col">
      <div className="flex h-11 shrink-0 items-center border-b border-neutral-800 px-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {titleMap[activeActivity]}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeActivity ===
          "explorer" && (
          <FileExplorer
            onOpenFile={() =>
              onWorkspaceViewChange(
                "editor",
              )
            }
          />
        )}

        {activeActivity ===
          "search" && (
          <SearchPanel />
        )}

        {activeActivity ===
          "git" && (
          <GitPanelPlaceholder />
        )}

        {activeActivity ===
          "tasks" && (
          <TasksPanel />
        )}
      </div>
    </aside>
  );
}
