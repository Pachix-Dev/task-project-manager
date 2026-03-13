"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTask } from "@/services/task-api";
import { sileo } from "sileo";

interface CreateTaskFormProps {
  projectId: number;
}

export function CreateTaskForm({ projectId }: CreateTaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask(projectId, { title: title.trim(), description: description.trim() || undefined });
      setTitle("");
      setDescription("");
      sileo.success({ title: "Tarea creada", description: "La tarea se agrego al proyecto." });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear la tarea";
      sileo.error({ title: "Error al crear tarea", description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur md:p-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--ink-900)]">Nueva tarea</h3>
        <p className="mt-1 text-sm text-[var(--ink-700)]">Agrega trabajo al proyecto y mantén el avance en movimiento.</p>
      </div>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Titulo"
        className="w-full rounded-lg border border-[var(--ink-700)]/25 bg-white px-3 py-2.5 text-sm text-[var(--ink-900)] outline-none ring-0 placeholder:text-[var(--ink-700)]/70 focus:border-[var(--brand-500)] focus:shadow-[0_0_0_3px_rgba(43,157,176,0.2)]"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descripcion"
        className="w-full rounded-lg border border-[var(--ink-700)]/25 bg-white px-3 py-2.5 text-sm text-[var(--ink-900)] outline-none ring-0 placeholder:text-[var(--ink-700)]/70 focus:border-[var(--brand-500)] focus:shadow-[0_0_0_3px_rgba(43,157,176,0.2)]"
        rows={3}
      />
      <button
        disabled={isSubmitting}
        className="rounded-lg bg-[var(--accent-500)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : "Crear tarea"}
      </button>
    </form>
  );
}
