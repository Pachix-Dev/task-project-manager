import { create } from "zustand";

interface ProjectStore {
  selectedProjectId: number | null;
  setSelectedProjectId: (projectId: number | null) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId })
}));
