import { X } from "lucide-react";
import type { EditorTab } from "../types";

type FileTabsProps = {
  tabs: EditorTab[];
  activePath: string | null;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
};

export function FileTabs({
  tabs,
  activePath,
  onSelect,
  onClose,
}: FileTabsProps) {
  if (tabs.length === 0) {
    return (
      <div className="flex h-10 items-center border-b border-neutral-800 bg-neutral-950 px-4 text-xs text-neutral-600">
        No open files
      </div>
    );
  }

  return (
    <div className="flex h-10 shrink-0 overflow-x-auto border-b border-neutral-800 bg-neutral-950">
      {tabs.map((tab) => {
        const isActive = activePath === tab.path;

        return (
          <div
            key={tab.path}
            className={[
              "group flex h-full min-w-0 items-center border-r border-neutral-800",
              isActive
                ? "bg-neutral-900 text-neutral-100"
                : "bg-neutral-950 text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200",
            ].join(" ")}
          >
            <button
              onClick={() => onSelect(tab.path)}
              type="button"
              className="flex h-full min-w-0 items-center gap-2 px-3 text-left text-xs"
              title={tab.path}
            >
              {tab.dirty && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
              )}

              <span className="truncate">{tab.name}</span>
            </button>

            <button
              onClick={() => onClose(tab.path)}
              type="button"
              className="mr-2 rounded-md p-1 text-neutral-600 opacity-0 transition hover:bg-neutral-800 hover:text-neutral-100 group-hover:opacity-100"
              aria-label={`Close ${tab.name}`}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
