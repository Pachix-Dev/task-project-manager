"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createProject } from "@/services/project-api";
import { sileo } from "sileo";

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-ink/10 bg-white/80 p-4">
      <h3 className="font-semibold text-ink">Nuevo proyecto</h3>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Nombre"
        className="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Descripción"
        className="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
        rows={3}
      />
      <button
        disabled={isSubmitting}
        className="rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : "Crear proyecto"}
      </button>
    </form>
  );
}