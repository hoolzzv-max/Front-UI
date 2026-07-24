import { ConsolePanel } from "../features/console/components/ConsolePanel";
import { DiagnosticsPanel } from "../features/diagnostics/components/DiagnosticsPanel";
import { LogsPanel } from "../features/logs/components/LogsPanel";

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

      <div className="h-[calc(100%-36px)] min-h-0">
        {activeTab === "console" && <ConsolePanel />}
        {activeTab === "logs" && <LogsPanel />}
        {activeTab === "diagnostics" && <DiagnosticsPanel />}
      </div>
    </section>
  );
}
