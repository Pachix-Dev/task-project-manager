"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { completeTask } from "@/services/task-api";
import { sileo } from "sileo";

interface CompleteTaskButtonProps {
  taskId: number;
}

export function CompleteTaskButton({ taskId }: CompleteTaskButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleComplete() {
    setIsSubmitting(true);
    try {
      await completeTask(taskId);
      sileo.success({ title: "Tarea completada", description: "La tarea se marco como completada." });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo completar la tarea";
      sileo.error({ title: "Error al completar tarea", description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      className="rounded-md bg-signal px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
      disabled={isSubmitting}
      onClick={handleComplete}
    >
      {isSubmitting ? "Completando..." : "Completar"}
    </button>
  );
}
