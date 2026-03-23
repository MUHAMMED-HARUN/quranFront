import { create } from "zustand";

interface MatterStore {
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;

    isFormOpen: boolean;
    openForm: () => void;
    closeForm: () => void;

    isCardOpen: boolean;
    openCard: () => void;
    closeCard: () => void;

    clearSelection: () => void;

    filters: { search?: string };
    setFilters: (filters: { search?: string }) => void;
    clearFilters: () => void;
}

export const useMatterStore = create<MatterStore>((set) => ({
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
    clearFilters: () => set({ filters: { search: "" } }),
}));
