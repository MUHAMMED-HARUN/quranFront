import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentScopeService } from "../services/assessmentScopeService";
import { CreateAssessmentScopeCommand, UpdateAssessmentScopeCommand } from "../types/assessmentScope.types";

export const useAssessmentScopesQuery = () => {
    return useQuery({
        queryKey: ["assessmentScopes"],
        queryFn: () => assessmentScopeService.getAll()
    });
};

export const useSearchAssessmentScopesQuery = (name: string) => {
    return useQuery({
        queryKey: ["assessmentScopes", "search", name],
        queryFn: () => assessmentScopeService.searchByName(name),
        enabled: name.length > 0
    });
};

export const useCreateAssessmentScopeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAssessmentScopeCommand) => assessmentScopeService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assessmentScopes"] });
        }
    });
};

export const useUpdateAssessmentScopeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAssessmentScopeCommand }) => assessmentScopeService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assessmentScopes"] });
        }
    });
};

export const useDeleteAssessmentScopeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => assessmentScopeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assessmentScopes"] });
        }
    });
};
