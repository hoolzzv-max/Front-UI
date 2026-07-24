import {
  Play,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Circle,
} from "lucide-react";

import { useTasks } from "../hooks/useTasks";

function getStatusColor(
  status: string,
) {
  switch (status) {
    case "completed":
      return "text-emerald-400";

    case "failed":
      return "text-red-400";

    case "running":
      return "text-blue-400";

    default:
      return "text-neutral-500";
  }
}

export function TasksPanel() {
  const {
    tasks,
    createTask,
    updateTaskStatus,
    clearCompleted,
    removeTask,
  } = useTasks();

  return (
    <div className="flex h-full flex-col bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-800 p-3">
        <h2 className="text-sm font-medium">
          Tasks
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() =>
              createTask(
                "New Task",
              )
            }
            className="rounded-lg border border-neutral-800 px-2 py-1 text-xs"
          >
            New
          </button>

          <button
            onClick={clearCompleted}
            className="rounded-lg border border-neutral-800 px-2 py-1 text-xs"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-sm">
                  {task.title}
                </div>

                <div
                  className={`text-xs mt-1 ${getStatusColor(
                    task.status,
                  )}`}
                >
                  {task.status}
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() =>
                    updateTaskStatus(
                      task.id,
                      "running",
                    )
                  }
                  className="rounded p-1 hover:bg-neutral-800"
                >
                  <Play size={14} />
                </button>

                <button
                  onClick={() =>
                    updateTaskStatus(
                      task.id,
                      "completed",
                    )
                  }
                  className="rounded p-1 hover:bg-neutral-800"
                >
                  <CheckCircle2
                    size={14}
                  />
                </button>

                <button
                  onClick={() =>
                    updateTaskStatus(
                      task.id,
                      "failed",
                    )
                  }
                  className="rounded p-1 hover:bg-neutral-800"
                >
                  <AlertTriangle
                    size={14}
                  />
                </button>

                <button
                  onClick={() =>
                    removeTask(
                      task.id,
                    )
                  }
                  className="rounded p-1 hover:bg-neutral-800"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-2 rounded-full bg-neutral-800">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${task.progress}%`,
                  }}
                />
              </div>

              <div className="mt-1 text-[11px] text-neutral-500">
                {task.progress}%
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
