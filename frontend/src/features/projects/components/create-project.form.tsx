"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject } from "@/services/project-api";
import { sileo } from "sileo";

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject({
        name: name.trim(),
        description: description.trim() || undefined
      });

      setName("");
      setDescription("");
      sileo.success({ title: "Proyecto creado", description: "El proyecto se registro correctamente." });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear el proyecto";
      sileo.error({ title: "Error al crear proyecto", description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:p-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--ink-900)]">Nuevo proyecto</h3>
        <p className="mt-1 text-sm text-[var(--ink-700)]">Registra el proyecto y empieza a agregar tareas.</p>
      </div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre"
        className="w-full rounded-lg border border-[var(--ink-700)]/25 bg-white px-3 py-2.5 text-sm text-[var(--ink-900)] outline-none ring-0 placeholder:text-[var(--ink-700)]/70 focus:border-[var(--brand-500)] focus:shadow-[0_0_0_3px_rgba(43,157,176,0.2)]"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descripción"
        className="w-full rounded-lg border border-[var(--ink-700)]/25 bg-white px-3 py-2.5 text-sm text-[var(--ink-900)] outline-none ring-0 placeholder:text-[var(--ink-700)]/70 focus:border-[var(--brand-500)] focus:shadow-[0_0_0_3px_rgba(43,157,176,0.2)]"
        rows={3}
      />
      <button
        disabled={isSubmitting}
        className="rounded-lg bg-[var(--accent-500)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : "Crear proyecto"}
      </button>
    </form>
  );
}