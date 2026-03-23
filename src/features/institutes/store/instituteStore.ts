import { create } from "zustand";

interface InstituteFilters {
    searchTerm?: string;
}

interface InstituteStore {
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    filters: InstituteFilters;
    setFilters: (filters: Partial<InstituteFilters>) => void;
    clearFilters: () => void;

    isFormOpen: boolean;
    openForm: () => void;
    closeForm: () => void;

    isCardOpen: boolean;
    openCard: () => void;
    closeCard: () => void;
}

export const useInstituteStore = create<InstituteStore>((set) => ({
    selectedIds: [],
    toggleSelection: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
        })),
    selectAll: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),

    filters: {},
    setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    clearFilters: () => set({ filters: {} }),

    isFormOpen: false,
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedIds: [] }),

    isCardOpen: false,
    openCard: () => set({ isCardOpen: true }),
    closeCard: () => set({ isCardOpen: false, selectedIds: [] }),
}));
