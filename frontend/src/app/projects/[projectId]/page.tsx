import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { getProject, getProjectMetrics } from "@/services/project-api";
import { getProjectTasks } from "@/services/task-api";

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId: rawProjectId } = await params;
  const projectId = Number(rawProjectId);

  if (Number.isNaN(projectId)) {
    return (
      <section className="space-y-5">
        <Link href="/projects" className="text-sm font-semibold text-signal hover:underline">
          Volver a proyectos
        </Link>
        <Alert message="ID de proyecto invalido" />
      </section>
    );
  }

  try {
    const [projectResponse, metricsResponse, tasksResponse] = await Promise.all([
      getProject(projectId),
      getProjectMetrics(projectId),
      getProjectTasks(projectId)
    ]);

    const project = projectResponse.data;
    const metrics = metricsResponse.data;
    const tasks = tasksResponse.data;

  return (
    <section className="space-y-5">
      <Link href="/projects" className="text-sm font-semibold text-signal hover:underline">
        Volver a proyectos
      </Link>

      <header className="rounded-lg border border-ink/10 bg-white/80 p-5">
        <h1 className="text-2xl font-extrabold text-ink">{project.name}</h1>
        <p className="mt-1 text-sm text-ink/70">{project.description ?? "Sin descripcion"}</p>
        <div className="mt-4 space-y-2">
          <ProgressBar value={metrics.progressPercentage} />
          <p className="text-sm text-ink/80">Tareas completadas: {metrics.completedTasks} / {metrics.totalTasks}</p>
          <p className="text-sm text-ink/80">
            Tiempo promedio de finalizacion (mm:ss): {metrics.averageCompletionTimeMmSs ?? "N/A"}
          </p>
        </div>
      </header>

      <CreateTaskForm projectId={projectId} />
      <TaskList tasks={tasks} />
    </section>
  );

  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return (
      <section className="space-y-5">
        <Link href="/projects" className="text-sm font-semibold text-signal hover:underline">
          Volver a proyectos
        </Link>
        <Alert message={message} />
      </section>
    );
  }
}
