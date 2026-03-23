import { create } from "zustand";

interface StudentEnrollmentState {
    selectedIds: string[];
    isFormOpen: boolean;
    isCardOpen: boolean;

    toggleSelection: (id: string) => void;
    selectAll: (ids: string[]) => void;
    clearSelection: () => void;

    openForm: (id?: string) => void;
    closeForm: () => void;

    openCard: () => void;
    closeCard: () => void;
}

export const useStudentEnrollmentStore = create<StudentEnrollmentState>((set) => ({
    selectedIds: [],
    isFormOpen: false,
    isCardOpen: false,

    toggleSelection: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id],
        })),

    selectAll: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),

    openForm: (id) => {
        if (id) {
            set({ selectedIds: [id], isFormOpen: true });
        } else {
            set({ selectedIds: [], isFormOpen: true });
        }
    },
    closeForm: () => set({ isFormOpen: false }),

    openCard: () => set({ isCardOpen: true }),
    closeCard: () => set({ isCardOpen: false }),
}));
