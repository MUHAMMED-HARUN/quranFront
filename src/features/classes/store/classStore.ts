import { create } from "zustand";

interface ClassFilters {
    searchTerm?: string;
    programId?: string;
}

interface ClassStore {
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    filters: ClassFilters;
    setFilters: (filters: Partial<ClassFilters>) => void;
    clearFilters: () => void;

    isFormOpen: boolean;
    openForm: () => void;
    closeForm: () => void;

    isCardOpen: boolean;
    openCard: () => void;
    closeCard: () => void;
}

export const useClassStore = create<ClassStore>((set) => ({
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
