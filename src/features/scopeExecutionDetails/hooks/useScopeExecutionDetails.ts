import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scopeExecutionDetailService } from "../services/scopeExecutionDetailService";
import { CreateScopeExecutionDetailCommand, UpdateScopeExecutionDetailCommand } from "../types/scopeExecutionDetail.types";
import { useScopeExecutionDetailStore } from "../store/scopeExecutionDetailStore";

export const useScopeExecutionDetailsQuery = () => {
    const filters = useScopeExecutionDetailStore((state) => state.filters);

    return useQuery({
        queryKey: ["scopeExecutionDetails", filters],
        queryFn: () => {
            if (filters.search && filters.search.trim().length > 0) {
                return scopeExecutionDetailService.searchByScopeExecutionName(filters.search.trim());
            }
            return scopeExecutionDetailService.getAll();
        }
    });
};

export const useCreateScopeExecutionDetailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateScopeExecutionDetailCommand) => scopeExecutionDetailService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeExecutionDetails"] });
        }
    });
};

export const useUpdateScopeExecutionDetailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateScopeExecutionDetailCommand }) => scopeExecutionDetailService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeExecutionDetails"] });
        }
    });
};

export const useDeleteScopeExecutionDetailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => scopeExecutionDetailService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scopeExecutionDetails"] });
        }
    });
};
