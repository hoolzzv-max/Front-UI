import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  Circle,
  Terminal,
} from "lucide-react";

export type BottomDrawerTab = "console" | "logs" | "diagnostics";

type BottomDrawerProps = {
  activeTab: BottomDrawerTab;
  onTabChange: (tab: BottomDrawerTab) => void;
};

const tabs: Array<{
  id: BottomDrawerTab;
  label: string;
}> = [
  {
    id: "console",
    label: "Console",
  },
  {
    id: "logs",
    label: "Logs",
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
  },
];

export function BottomDrawer({ activeTab, onTabChange }: BottomDrawerProps) {
  return (
    <section className="h-60 shrink-0 border-t border-neutral-800 bg-neutral-950">
      <div className="flex h-9 items-center justify-between border-b border-neutral-800">
        <div className="flex h-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={[
                  "h-full border-r border-neutral-800 px-4 text-xs transition",
                  isActive
                    ? "bg-neutral-900 text-neutral-100"
                    : "text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300",
                ].join(" ")}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 px-3 text-xs text-neutral-600 sm:flex">
          <span>Ctrl J</span>
        </div>
      </div>

      <div className="h-[calc(100%-36px)] overflow-auto p-4">
        {activeTab === "console" && (
          <div className="font-mono text-xs leading-6 text-neutral-400">
            <div className="flex items-center gap-2 text-neutral-300">
              <Terminal size={15} className="text-blue-400" />
              <span>Console is ready</span>
            </div>

            <p className="mt-3 text-neutral-500">$ workspace shell initialized</p>
            <p className="text-neutral-500">$ waiting for backend connection</p>
            <p className="mt-2 text-neutral-600">
              سيتم عرض مخرجات الطرفية الحقيقية هنا عند ربط Backend / Aider.
            </p>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
              <Circle size={14} className="mt-0.5 text-blue-400" />
              <div>
                <p className="text-neutral-300">Shell mounted</p>
                <p className="mt-1 text-neutral-500">
                  AppShell, Header, Sidebar, panels and drawers are active.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
              <Circle size={14} className="mt-0.5 text-neutral-500" />
              <div>
                <p className="text-neutral-300">Integration pending</p>
                <p className="mt-1 text-neutral-500">
                  Features and backend services are not connected yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "diagnostics" && (
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <CheckCircle2 size={15} className="mt-0.5 text-emerald-400" />
              <div>
                <p className="text-emerald-300">No blocking issues</p>
                <p className="mt-1 text-neutral-500">
                  Shell layer is operational.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
              <AlertTriangle size={15} className="mt-0.5 text-yellow-400" />
              <div>
                <p className="text-yellow-300">Backend not connected</p>
                <p className="mt-1 text-neutral-500">
                  هذا طبيعي في هذه المرحلة. سيتم الربط لاحقًا.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
              <Bug size={15} className="mt-0.5 text-neutral-500" />
              <div>
                <p className="text-neutral-300">Diagnostics ready</p>
                <p className="mt-1 text-neutral-500">
                  سيتم عرض أخطاء TypeScript و runtime هنا لاحقًا.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
