import { CreateProjectForm } from "@/features/projects/components/create-project.form";
import { ProjectList } from "@/features/projects/components/project-list";

export default function ProjectsPage() {
  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Proyectos</h1>
        <p className="text-sm text-ink/70">Gestiona progreso y tareas por proyecto.</p>
      </header>  
      <CreateProjectForm />
      <ProjectList />      
    </section>
  );
}