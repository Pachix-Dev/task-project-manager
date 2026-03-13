"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-ink/10 bg-white/80 p-4">
      <h3 className="font-semibold text-ink">Nueva tarea</h3>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Titulo"
        className="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descripcion"
        className="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
        rows={3}
      />
      <button
        disabled={isSubmitting}
        className="rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : "Crear tarea"}
      </button>
    </form>
  );
}
