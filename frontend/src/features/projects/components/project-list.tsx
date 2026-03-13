import Link from "next/link";
import { getProjects } from "@/services/project-api";


 export async function ProjectList() {

  try {

      const response = await getProjects();      
      if (response.data.length === 0) {
        return (
          <div className="rounded-xl border border-dashed border-[var(--ink-700)]/35 bg-white/70 p-8 text-center text-sm text-[var(--ink-700)]">
            No hay proyectos registrados.
          </div>
        );
      }

      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {response.data.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group rounded-xl border border-[var(--ink-700)]/15 bg-white/90 p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-500)]/45 hover:shadow-lg"
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--brand-600)]">Proyecto</p>
              <h3 className="text-lg font-semibold text-[var(--ink-900)] group-hover:text-[var(--brand-600)]">{project.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--ink-700)]">{project.description ?? "Sin descripcion"}</p>
            </Link>
          ))}
        </div>
      );

   } catch (error) {

    const message = error instanceof Error ? error.message : "Error inesperado";
    
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {message}
      </div>
    );

  }
  
}
