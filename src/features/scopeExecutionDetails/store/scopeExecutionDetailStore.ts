import { create } from "zustand";

interface ScopeExecutionDetailStore {
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    clearSelection: () => void;

    filters: { search: string };
    setFilters: (filters: Partial<{ search: string }>) => void;
    clearFilters: () => void;
}

export const useScopeExecutionDetailStore = create<ScopeExecutionDetailStore>((set) => ({
    selectedIds: [],
    setSelectedIds: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),

    filters: { search: "" },
    setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    clearFilters: () => set({ filters: { search: "" } })
}));
