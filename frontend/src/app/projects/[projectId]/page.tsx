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
      <section className="space-y-6">
        <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[var(--ink-700)] hover:text-[var(--brand-600)]">
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
    <section className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[var(--ink-700)] transition hover:text-[var(--brand-600)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Volver a proyectos</span>
      </Link>

      <header className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:p-7">
        <p className="mb-2 inline-flex rounded-full bg-[var(--brand-600)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand-600)]">
          Detalle del proyecto
        </p>
        <h1 className="text-2xl font-bold text-[var(--ink-900)] md:text-3xl">{project.name}</h1>
        <p className="mt-2 text-sm text-[var(--ink-700)] md:text-base">{project.description ?? "Sin descripcion"}</p>
        <div className="mt-5 space-y-2">
          <ProgressBar value={metrics.progressPercentage} />
          <p className="text-sm font-medium text-[var(--ink-700)]">Tareas completadas: {metrics.completedTasks} / {metrics.totalTasks}</p>
          <p className="text-sm font-medium text-[var(--ink-700)]">
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
      <section className="space-y-6">
        <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-[var(--ink-700)] hover:text-[var(--brand-600)]">
          Volver a proyectos
        </Link>
        <Alert message={message} />
      </section>
    );
  }
}
