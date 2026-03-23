import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scopeExecutionService } from "../services/scopeExecutionService";
import { CreateScopeExecutionCommand, UpdateScopeExecutionCommand } from "../types/scopeExecution.types";

export const useScopeExecutionsQuery = () => {
    return useQuery({
        queryKey: ["scopeExecutions"],
        queryFn: () => scopeExecutionService.getAll()
    });
};

export const useSearchScopeExecutionsQuery = (name: string) => {
    return useQuery({
        queryKey: ["scopeExecutions", "search", name],
        queryFn: () => scopeExecutionService.searchByName(name),
        enabled: name.length > 0
    });
};

export const useCreateScopeExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateScopeExecutionCommand) => scopeExecutionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeExecutions"] });
        }
    });
};

export const useUpdateScopeExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateScopeExecutionCommand }) => scopeExecutionService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeExecutions"] });
        }
    });
};

export const useDeleteScopeExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => scopeExecutionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeExecutions"] });
        }
    });
};
