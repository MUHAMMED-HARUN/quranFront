import { create } from "zustand";

interface StudentAssessmentStore {
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    clearSelection: () => void;
}

export const useStudentAssessmentStore = create<StudentAssessmentStore>((set) => ({
    selectedIds: [],
    setSelectedIds: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] })
}));
