import { CreateProjectForm } from "@/features/projects/components/create-project.form";
import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-white/60 bg-white/55 p-5 shadow-sm backdrop-blur md:p-7">
        <p className="mb-2 inline-flex rounded-full bg-[var(--brand-600)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand-600)]">
          Panel de trabajo
        </p>
        <h1 className="text-3xl font-bold text-[var(--ink-900)] md:text-4xl">Proyectos</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--ink-700)] md:text-base">
          Crea, organiza y revisa el avance de cada proyecto desde una vista central con enfoque en claridad.
        </p>
      </header>  

      <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <CreateProjectForm />
        <div className="rounded-2xl border border-white/60 bg-white/60 p-4 shadow-sm backdrop-blur md:p-5">
          <ProjectList />
        </div>
      </div>
    </section>
  );
}