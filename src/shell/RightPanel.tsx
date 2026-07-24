import type { SidebarActivity } from "./Sidebar";

type RightPanelProps = {
  activeView: string;
  activeActivity: SidebarActivity;
};

export function RightPanel({ activeView, activeActivity }: RightPanelProps) {
  return (
    <aside className="hidden min-w-0 border-l border-neutral-800 bg-neutral-950 lg:block">
      <div className="border-b border-neutral-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-100">Details</h2>
        <p className="mt-0.5 text-xs text-neutral-500">
          Contextual information
        </p>
      </div>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium text-neutral-100">
            Current Context
          </h3>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Workspace View</span>
              <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2 py-1 capitalize text-neutral-300">
                {activeView}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Activity</span>
              <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2 py-1 capitalize text-neutral-300">
                {activeActivity}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium text-neutral-100">
            System State
          </h3>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Shell</span>
              <span className="text-emerald-400">Ready</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Features</span>
              <span className="text-yellow-400">Pending</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Backend</span>
              <span className="text-neutral-500">Not connected</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-neutral-500">Aider</span>
              <span className="text-neutral-500">Not connected</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h3 className="text-sm font-medium text-neutral-100">
            Next Integration
          </h3>

          <p className="mt-3 text-xs leading-6 text-neutral-500">
            المرحلة التالية هي تركيب Providers ثم Config و Types وبعدها
            Chat feature بشكل مستقل.
          </p>
        </div>
      </div>
    </aside>
  );
}
