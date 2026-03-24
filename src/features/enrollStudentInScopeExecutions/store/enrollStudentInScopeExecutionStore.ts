import { create } from "zustand";

interface EnrollStudentInScopeExecutionFilters {
    search: string;
    scopeExecutionId: string | null;
}

interface EnrollStudentInScopeExecutionStore {
    selectedIds: string[];
    isFormOpen: boolean;
    isCardOpen: boolean;
    filters: EnrollStudentInScopeExecutionFilters;

    setSelectedIds: (ids: string[]) => void;
    toggleSelection: (id: string) => void;
    clearSelection: () => void;

    openForm: () => void;
    closeForm: () => void;
    openCard: () => void;
    closeCard: () => void;

    setFilters: (filters: Partial<EnrollStudentInScopeExecutionFilters>) => void;
    clearFilters: () => void;
}

export const useEnrollStudentInScopeExecutionStore = create<EnrollStudentInScopeExecutionStore>((set) => ({
    selectedIds: [],
    isFormOpen: false,
    isCardOpen: false,
    filters: {
        search: "",
        scopeExecutionId: null,
    },

    setSelectedIds: (ids) => set({ selectedIds: ids }),
    toggleSelection: (id) => set((state) => ({
        selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedIds, id]
    })),
    clearSelection: () => set({ selectedIds: [] }),

    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedIds: [] }),
    openCard: () => set({ isCardOpen: true }),
    closeCard: () => set({ isCardOpen: false }),

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    clearFilters: () => set({ filters: { search: "", scopeExecutionId: null } }),
}));
