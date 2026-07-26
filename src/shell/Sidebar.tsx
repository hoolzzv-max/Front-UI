import type { LucideIcon } from "lucide-react";
import { Files, GitBranch, ListChecks, Search } from "lucide-react";

export type SidebarActivity = "explorer" | "search" | "git" | "tasks";

type SidebarItem = {
  id: SidebarActivity;
  label: string;
  icon: LucideIcon;
};

type SidebarProps = {
  activeActivity: SidebarActivity;
  onActivityChange: (activity: SidebarActivity) => void;
};

const sidebarItems: SidebarItem[] = [
  {
    id: "explorer",
    label: "Explorer",
    icon: Files,
  },
  {
    id: "search",
    label: "Search",
    icon: Search,
  },
  {
    id: "git",
    label: "Source Control",
    icon: GitBranch,
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: ListChecks,
  },
];

export function Sidebar({ activeActivity, onActivityChange }: SidebarProps) {
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center border-r border-neutral-800 bg-neutral-950 py-2">
      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeActivity === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onActivityChange(item.id)}
              className={[
                "relative flex h-10 w-10 items-center justify-center rounded-xl transition",
                isActive
                  ? "bg-neutral-800 text-blue-400"
                  : "text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200",
              ].join(" ")}
              title={item.label}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute left-0 h-5 w-0.5 rounded-full bg-blue-500" />
              )}

              <Icon size={19} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
