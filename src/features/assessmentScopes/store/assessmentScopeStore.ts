import { create } from "zustand";

interface AssessmentScopeStore {
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    clearSelection: () => void;
}

export const useAssessmentScopeStore = create<AssessmentScopeStore>((set) => ({
    selectedIds: [],
    setSelectedIds: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] })
}));
