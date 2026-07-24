import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./Header";
import { Sidebar, type SidebarActivity } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { BottomDrawer, type BottomDrawerTab } from "./BottomDrawer";
import { RightPanel } from "./RightPanel";
import {
  CommandPalette,
  type CommandPaletteItem,
} from "./CommandPalette";
import {
  NotificationCenter,
  type AppNotification,
} from "./NotificationCenter";
import { ChatPanel } from "../features/chat/components/ChatPanel";
import { EditorPanel } from "../features/editor/components/EditorPanel";
import { FileExplorer } from "../features/explorer/components/FileExplorer";
import { PromptComposer } from "../features/prompt/components/PromptComposer";

type WorkspaceView = "chat" | "editor" | "diff";

const KEYBOARD_EVENTS = {
  OPEN_COMMAND_PALETTE: "workspace:open-command-palette",
  TOGGLE_BOTTOM_DRAWER: "workspace:toggle-bottom-drawer",
  TOGGLE_RIGHT_PANEL: "workspace:toggle-right-panel",
  FOCUS_PROMPT: "workspace:focus-prompt",
} as const;

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

function isMacPlatform() {
  if (typeof navigator === "undefined") return false;

  return /mac|iphone|ipad|ipod/i.test(navigator.platform);
}

function WorkspacePlaceholder({ view }: { view: WorkspaceView }) {
  const content = {
    chat: {
      title: "Chat Workspace",
      description:
        "هنا سيتم تركيب ChatPanel لاحقًا. هذه المساحة مخصصة للمحادثة مع الوكيل وتشغيل التعليمات ومتابعة النتائج.",
      badge: "Primary",
    },
    editor: {
      title: "Editor Workspace",
      description:
        "هنا سيتم تركيب EditorPanel و FileTabs لاحقًا لعرض الملفات وتعديلها ومراجعة التغييرات.",
      badge: "Code",
    },
    diff: {
      title: "Diff Workspace",
      description:
        "هنا سيتم عرض الفروقات بين الملفات قبل وبعد تنفيذ أوامر Aider أو أي Agent آخر.",
      badge: "Review",
    },
  } satisfies Record<WorkspaceView, {
    title: string;
    description: string;
    badge: string;
  }>;

  const current = content[view];

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-lg font-bold text-blue-400">
          AI
        </div>

        <div className="mb-3 inline-flex rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1 text-xs text-neutral-400">
          {current.badge}
        </div>

        <h1 className="text-xl font-semibold text-neutral-100">
          {current.title}
        </h1>

        <p className="mt-3 text-sm leading-7 text-neutral-400">
          {current.description}
        </p>
      </div>
    </div>
  );
}

function ActivityPanel({
  activeActivity,
  onWorkspaceViewChange,
}: {
  activeActivity: SidebarActivity;
  onWorkspaceViewChange: (view: WorkspaceView) => void;
}) {
  const titleMap: Record<SidebarActivity, string> = {
    explorer: "Explorer",
    search: "Search",
    git: "Source Control",
    tasks: "Tasks",
  };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-neutral-800 bg-neutral-950 md:block">
      <div className="border-b border-neutral-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {titleMap[activeActivity]}
        </h2>
      </div>

      <div className="p-3">
        {activeActivity === "explorer" && (
          <div className="space-y-2">
            <button
              onClick={() => onWorkspaceViewChange("chat")}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-left text-sm text-neutral-200 hover:border-neutral-700"
            >
              Chat
              <p className="mt-1 text-xs text-neutral-500">
                واجهة المحادثة الأساسية
              </p>
            </button>

            <button
              onClick={() => onWorkspaceViewChange("editor")}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-left text-sm text-neutral-200 hover:border-neutral-700"
            >
              Editor
              <p className="mt-1 text-xs text-neutral-500">
                محرر الملفات والكود
              </p>
            </button>

            <button
              onClick={() => onWorkspaceViewChange("diff")}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-left text-sm text-neutral-200 hover:border-neutral-700"
            >
              Diff
              <p className="mt-1 text-xs text-neutral-500">
                مراجعة التغييرات
              </p>
            </button>
          </div>
        )}

        {activeActivity === "search" && (
          <div className="space-y-3">
            <input
              placeholder="Search files, commands, logs..."
              className="h-9 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-blue-500"
            />

            <p className="text-xs leading-6 text-neutral-500">
              سيتم ربط البحث لاحقًا بالملفات، السجلات، والمهام.
            </p>
          </div>
        )}

        {activeActivity === "git" && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
            <h3 className="text-sm font-medium text-neutral-200">
              Repository
            </h3>
            <p className="mt-2 text-xs leading-6 text-neutral-500">
              لا يوجد Git provider متصل حاليًا. سيتم تركيب GitPanel لاحقًا.
            </p>
          </div>
        )}

        {activeActivity === "tasks" && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
            <h3 className="text-sm font-medium text-neutral-200">
              Active Tasks
            </h3>
            <p className="mt-2 text-xs leading-6 text-neutral-500">
              لا توجد مهام نشطة الآن. سيتم تركيب TasksPanel لاحقًا.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export function AppShell() {
  const [activeActivity, setActiveActivity] =
    useState<SidebarActivity>("explorer");

  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("chat");
  const [bottomTab, setBottomTab] = useState<BottomDrawerTab>("console");

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] =
    useState(false);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(true);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "shell-ready",
      title: "Shell initialized",
      description: "تم تشغيل واجهة Shell بنجاح.",
      type: "success",
      createdAt: "now",
      unread: true,
    },
  ]);

  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  const toggleBottomDrawer = useCallback(() => {
    setIsBottomDrawerOpen((value) => !value);
  }, []);

  const toggleRightPanel = useCallback(() => {
    setIsRightPanelOpen((value) => !value);
  }, []);

  const toggleNotificationCenter = useCallback(() => {
    setIsNotificationCenterOpen((value) => !value);
  }, []);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications((items) =>
      items.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  }, []);

  const commands = useMemo<CommandPaletteItem[]>(
    () => [
      {
        id: "workspace.open-chat",
        title: "Open Chat Workspace",
        section: "Workspace",
        shortcut: "Ctrl Shift 1",
        action: () => setWorkspaceView("chat"),
      },
      {
        id: "workspace.open-editor",
        title: "Open Editor Workspace",
        section: "Workspace",
        shortcut: "Ctrl Shift 2",
        action: () => setWorkspaceView("editor"),
      },
      {
        id: "workspace.open-diff",
        title: "Open Diff Workspace",
        section: "Workspace",
        shortcut: "Ctrl Shift 3",
        action: () => setWorkspaceView("diff"),
      },
      {
        id: "panel.toggle-bottom",
        title: "Toggle Bottom Drawer",
        section: "View",
        shortcut: "Ctrl J",
        action: toggleBottomDrawer,
      },
      {
        id: "panel.toggle-right",
        title: "Toggle Right Panel",
        section: "View",
        shortcut: "Ctrl Shift R",
        action: toggleRightPanel,
      },
      {
        id: "activity.explorer",
        title: "Show Explorer",
        section: "Activity",
        action: () => setActiveActivity("explorer"),
      },
      {
        id: "activity.search",
        title: "Show Search",
        section: "Activity",
        action: () => setActiveActivity("search"),
      },
      {
        id: "activity.git",
        title: "Show Source Control",
        section: "Activity",
        action: () => setActiveActivity("git"),
      },
      {
        id: "activity.tasks",
        title: "Show Tasks",
        section: "Activity",
        action: () => setActiveActivity("tasks"),
      },
    ],
    [toggleBottomDrawer, toggleRightPanel],
  );

  useEffect(() => {
    const handleCustomOpenCommandPalette = () => openCommandPalette();
    const handleCustomToggleBottomDrawer = () => toggleBottomDrawer();
    const handleCustomToggleRightPanel = () => toggleRightPanel();

    window.addEventListener(
      KEYBOARD_EVENTS.OPEN_COMMAND_PALETTE,
      handleCustomOpenCommandPalette,
    );
    window.addEventListener(
      KEYBOARD_EVENTS.TOGGLE_BOTTOM_DRAWER,
      handleCustomToggleBottomDrawer,
    );
    window.addEventListener(
      KEYBOARD_EVENTS.TOGGLE_RIGHT_PANEL,
      handleCustomToggleRightPanel,
    );

    return () => {
      window.removeEventListener(
        KEYBOARD_EVENTS.OPEN_COMMAND_PALETTE,
        handleCustomOpenCommandPalette,
      );
      window.removeEventListener(
        KEYBOARD_EVENTS.TOGGLE_BOTTOM_DRAWER,
        handleCustomToggleBottomDrawer,
      );
      window.removeEventListener(
        KEYBOARD_EVENTS.TOGGLE_RIGHT_PANEL,
        handleCustomToggleRightPanel,
      );
    };
  }, [openCommandPalette, toggleBottomDrawer, toggleRightPanel]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) return;

      const isMac = isMacPlatform();
      const modKey = isMac ? event.metaKey : event.ctrlKey;
      const key = event.key.toLowerCase();

      if (modKey && event.shiftKey && key === "p") {
        event.preventDefault();
        openCommandPalette();
        return;
      }

      if (modKey && key === "j") {
        event.preventDefault();
        toggleBottomDrawer();
        return;
      }

      if (modKey && event.shiftKey && key === "r") {
        event.preventDefault();
        toggleRightPanel();
        return;
      }

      if (modKey && event.shiftKey && key === "1") {
        event.preventDefault();
        setWorkspaceView("chat");
        return;
      }

      if (modKey && event.shiftKey && key === "2") {
        event.preventDefault();
        setWorkspaceView("editor");
        return;
      }

      if (modKey && event.shiftKey && key === "3") {
        event.preventDefault();
        setWorkspaceView("diff");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openCommandPalette, toggleBottomDrawer, toggleRightPanel]);

  const unreadNotificationsCount = notifications.filter(
    (item) => item.unread,
  ).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      <div className="flex h-full min-h-0 flex-col">
        <Header
          workspaceName="AI Development Workspace"
          activeView={workspaceView}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenCommandPalette={openCommandPalette}
          onToggleNotifications={() => {
            toggleNotificationCenter();
            markNotificationsAsRead();
          }}
          onToggleRightPanel={toggleRightPanel}
          onToggleBottomDrawer={toggleBottomDrawer}
        />

        <div className="flex min-h-0 flex-1">
          <Sidebar
            activeActivity={activeActivity}
            onActivityChange={setActiveActivity}
          />

          <ActivityPanel
            activeActivity={activeActivity}
            onWorkspaceViewChange={setWorkspaceView}
          />

          <main className="flex min-w-0 flex-1 flex-col">
            <section className="grid min-h-0 flex-1 grid-cols-1 bg-neutral-950 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="flex min-w-0 flex-col">
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-neutral-500">Workspace</span>
                    <span className="text-neutral-700">/</span>
                    <span className="font-medium capitalize text-neutral-200">
                      {workspaceView}
                    </span>
                  </div>

                  <div className="hidden items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-500 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Ready
                  </div>
                </div>

                <div className="min-h-0 flex-1">
                  {workspaceView === "chat" && <ChatPanel />}
                  {workspaceView === "editor" && <EditorPanel />}
                  {workspaceView === "diff" && <WorkspacePlaceholder view="diff" />}
                </div>
              </div>

              {isRightPanelOpen && (
                <RightPanel
                  activeView={workspaceView}
                  activeActivity={activeActivity}
                />
              )}
            </section>

            {isBottomDrawerOpen && (
              <BottomDrawer activeTab={bottomTab} onTabChange={setBottomTab} />
            )}
          </main>
        </div>

        <PromptComposer />

        <StatusBar
          status="Ready"
          model="Not connected"
          workspace="local"
          branch="main"
          encoding="UTF-8"
          language="TypeScript"
        />
      </div>

      <CommandPalette
        open={isCommandPaletteOpen}
        commands={commands}
        onClose={closeCommandPalette}
      />

      <NotificationCenter
        open={isNotificationCenterOpen}
        notifications={notifications}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  );
}
