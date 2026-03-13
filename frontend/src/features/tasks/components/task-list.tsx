import type { Task } from "@/types/api";
import { CompleteTaskButton } from "@/features/tasks/components/complete-task-button.client";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-ink/70">Este proyecto aun no tiene tareas.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-md border border-ink/10 bg-white p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink">{task.title}</p>
              <p className="text-sm text-ink/70">{task.description ?? "Sin descripcion"}</p>
            </div>
            {task.status === "pending" ? (
              <CompleteTaskButton taskId={task.id} />
            ) : (
              <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                Completada
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
