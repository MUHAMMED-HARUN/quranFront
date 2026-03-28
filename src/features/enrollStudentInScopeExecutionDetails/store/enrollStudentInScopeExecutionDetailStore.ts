import { create } from "zustand";
import { EnrollStudentInScopeExecutionDetail } from "../types/enrollStudentInScopeExecutionDetail.types";

interface EnrollStudentInScopeExecutionDetailState {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isFormOpen: boolean;
    setFormOpen: (isOpen: boolean) => void;
    selectedItem: EnrollStudentInScopeExecutionDetail | null;
    setSelectedItem: (item: EnrollStudentInScopeExecutionDetail | null) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

export const useEnrollStudentInScopeExecutionDetailStore = create<EnrollStudentInScopeExecutionDetailState>((set) => ({
    searchTerm: "",
    setSearchTerm: (term) => set({ searchTerm: term }),
    isFormOpen: false,
    setFormOpen: (isOpen) => set({ isFormOpen: isOpen }),
    selectedItem: null,
    setSelectedItem: (item) => set({ selectedItem: item }),
    isEditing: false,
    setIsEditing: (isEditing) => set({ isEditing })
}));
