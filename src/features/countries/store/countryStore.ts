import { create } from "zustand";

export interface CountryFilters {
    SearchTerm?: string;
}

interface CountryStore {
    // MultiSelect State
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    // Filters State
    filters: CountryFilters;
    setFilters: (filters: CountryFilters) => void;

    // Form State (Add/Edit)
    isFormOpen: boolean;
    openForm: () => void;
    closeForm: () => void;

    // Entity Card State (Details Popup)
    isCardOpen: boolean;
    cardEntityId: string | null;
    openCard: (id: string) => void;
    closeCard: () => void;
}

export const useCountryStore = create<CountryStore>((set) => ({
    selectedIds: [],
    toggleSelection: (id) =>
        set((state) => {
            const isSelected = state.selectedIds.includes(id);
            return {
                selectedIds: isSelected
                    ? state.selectedIds.filter((selectedId) => selectedId !== id)
                    : [...state.selectedIds, id],
            };
        }),
    selectAll: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),

    filters: {},
    setFilters: (filters) => set({ filters }),

    isFormOpen: false,
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false }),

    isCardOpen: false,
    cardEntityId: null,
    openCard: (id) => set({ isCardOpen: true, cardEntityId: id }),
    closeCard: () => set({ isCardOpen: false, cardEntityId: null }),
}));
