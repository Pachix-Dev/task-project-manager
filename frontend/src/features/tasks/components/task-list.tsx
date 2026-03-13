import type { Task } from "@/types/api";
import { CompleteTaskButton } from "@/features/tasks/components/complete-task-button.client";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--ink-700)]/35 bg-white/65 p-6 text-center text-sm font-semibold text-[var(--ink-700)]">
        Este proyecto aun no tiene tareas.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-xl border border-[var(--ink-700)]/15 bg-white/90 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[var(--ink-900)]">{task.title}</p>
              <p className="mt-1 text-sm text-[var(--ink-700)]">{task.description ?? "Sin descripcion"}</p>
            </div>
            {task.status === "pending" ? (
              <CompleteTaskButton taskId={task.id} />
            ) : (
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                Completada
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
