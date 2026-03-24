import { create } from "zustand";

interface DailyEvaluationFilters {
    search: string;
}

interface DailyEvaluationStore {
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

    filters: DailyEvaluationFilters;
    setFilters: (filters: Partial<DailyEvaluationFilters>) => void;
    clearFilters: () => void;
}

export const useDailyEvaluationStore = create<DailyEvaluationStore>((set) => ({
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
