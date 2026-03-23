import { create } from "zustand";

interface ScopeExecutionStore {
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    isFormOpen: boolean;
    openForm: () => void;
    closeForm: () => void;

    isCardOpen: boolean;
    openCard: () => void;
    closeCard: () => void;

    filters: { search: string };
    setFilters: (filters: Partial<{ search: string }>) => void;
    clearFilters: () => void;
}

export const useScopeExecutionStore = create<ScopeExecutionStore>((set) => ({
    selectedIds: [],
    toggleSelection: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
        })),
    selectAll: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),

    isFormOpen: false,
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false, selectedIds: [] }),

    isCardOpen: false,
    openCard: () => set({ isCardOpen: true }),
    closeCard: () => set({ isCardOpen: false, selectedIds: [] }),

    filters: { search: "" },
    setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    clearFilters: () => set({ filters: { search: "" } })
}));
