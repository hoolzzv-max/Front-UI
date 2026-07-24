import {
  Bell,
  ChevronDown,
  Command,
  Moon,
  PanelBottom,
  PanelRight,
  Settings,
  Sparkles,
} from "lucide-react";

type HeaderProps = {
  workspaceName: string;
  activeView: string;
  unreadNotificationsCount: number;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  onToggleRightPanel: () => void;
  onToggleBottomDrawer: () => void;
};

export function Header({
  workspaceName,
  activeView,
  unreadNotificationsCount,
  onOpenCommandPalette,
  onToggleNotifications,
  onToggleRightPanel,
  onToggleBottomDrawer,
}: HeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
          A
        </div>

        <button className="flex min-w-0 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800">
          <span className="max-w-[180px] truncate">{workspaceName}</span>
          <ChevronDown size={14} className="shrink-0 text-neutral-500" />
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-500 md:flex">
          <Sparkles size={13} className="text-blue-400" />
          <span className="capitalize">{activeView}</span>
        </div>
      </div>

      <button
        onClick={onOpenCommandPalette}
        className="mx-4 hidden min-w-[360px] items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-500 transition hover:border-neutral-700 hover:bg-neutral-800 lg:flex"
      >
        <span>Search commands...</span>
        <span className="rounded-md border border-neutral-700 px-1.5 py-0.5 text-[11px] text-neutral-400">
          Ctrl Shift P
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onToggleBottomDrawer}
          className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          title="Toggle bottom drawer"
          type="button"
        >
          <PanelBottom size={18} />
        </button>

        <button
          onClick={onToggleRightPanel}
          className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          title="Toggle right panel"
          type="button"
        >
          <PanelRight size={18} />
        </button>

        <button
          onClick={onToggleNotifications}
          className="relative rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          title="Notifications"
          type="button"
        >
          <Bell size={18} />

          {unreadNotificationsCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <button
          className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          title="Theme"
          type="button"
        >
          <Moon size={18} />
        </button>

        <button
          className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
          title="Settings"
          type="button"
        >
          <Settings size={18} />
        </button>

        <button
          className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-xs font-semibold text-neutral-200"
          title="User"
          type="button"
        >
          U
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100 lg:hidden"
          title="Command palette"
          type="button"
        >
          <Command size={18} />
        </button>
      </div>
    </header>
  );
}
