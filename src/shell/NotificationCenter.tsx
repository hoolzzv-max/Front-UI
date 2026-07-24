import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

export type AppNotification = {
  id: string;
  title: string;
  description?: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
  unread?: boolean;
};

type NotificationCenterProps = {
  open: boolean;
  notifications: AppNotification[];
  onClose: () => void;
};

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "success") {
    return <CheckCircle2 size={17} className="text-emerald-400" />;
  }

  if (type === "warning") {
    return <TriangleAlert size={17} className="text-yellow-400" />;
  }

  if (type === "error") {
    return <TriangleAlert size={17} className="text-red-400" />;
  }

  return <Info size={17} className="text-blue-400" />;
}

export function NotificationCenter({
  open,
  notifications,
  onClose,
}: NotificationCenterProps) {
  if (!open) return null;

  return (
    <div className="fixed right-3 top-14 z-40 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            Notifications
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Workspace updates
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-100"
          type="button"
          aria-label="Close notifications"
        >
          <X size={17} />
        </button>
      </div>

      <div className="max-h-[420px] overflow-auto p-3">
        {notifications.length === 0 && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-500">
            لا توجد إشعارات.
          </div>
        )}

        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <NotificationIcon type={notification.type} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-neutral-200">
                      {notification.title}
                    </p>

                    {notification.unread && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    )}
                  </div>

                  {notification.description && (
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {notification.description}
                    </p>
                  )}

                  <p className="mt-2 text-[11px] text-neutral-600">
                    {notification.createdAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
