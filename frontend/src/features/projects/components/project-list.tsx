import Link from "next/link";
import { getProjects } from "@/services/project-api";


 export async function ProjectList() {

  try {

      const response = await getProjects();      
      if (response.data.length === 0) {
        return (
          <div className="rounded-lg border border-dashed border-ink/30 bg-white/60 p-6 text-sm text-ink/70">
            No hay proyectos registrados.
          </div>
        );
      }

      return (
        <div className="grid gap-4 md:grid-cols-2">
          {response.data.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-lg border border-ink/10 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{project.description ?? "Sin descripción"}</p>
            </Link>
          ))}
        </div>
      );

   } catch (error) {

    const message = error instanceof Error ? error.message : "Error inesperado";
    
    return (
      <div className="rounded-lg border border-dashed border-ink/30 bg-white/60 p-6 text-sm text-ink/70">
        {message}
      </div>
    );

  }
  
}
