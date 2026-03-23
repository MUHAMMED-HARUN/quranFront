import { create } from "zustand";

interface DailyTrackingStore {
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    clearSelection: () => void;
}

export const useDailyTrackingStore = create<DailyTrackingStore>((set) => ({
    selectedIds: [],
    setSelectedIds: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] })
}));
