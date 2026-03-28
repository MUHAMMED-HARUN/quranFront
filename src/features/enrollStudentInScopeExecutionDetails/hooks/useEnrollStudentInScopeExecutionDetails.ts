import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollStudentInScopeExecutionDetailService } from "../services/enrollStudentInScopeExecutionDetailService";
import {
    CreateEnrollStudentInScopeExecutionDetailCommand,
    UpdateEnrollStudentInScopeExecutionDetailCommand
} from "../types/enrollStudentInScopeExecutionDetail.types";

export const KEYS = {
    all: ["enrollStudentInScopeExecutionDetails"] as const,
    details: () => [...KEYS.all, "detail"] as const,
    detail: (id: string) => [...KEYS.details(), id] as const,
    byScopeExecutionDetailId: (id: string) => [...KEYS.all, "byScopeExecutionDetailId", id] as const,
};

export const useEnrollStudentInScopeExecutionDetailsQuery = () => {
    return useQuery({
        queryKey: KEYS.all,
        queryFn: () => enrollStudentInScopeExecutionDetailService.getAll()
    });
};

export const useEnrollStudentInScopeExecutionDetailByIdQuery = (id: string) => {
    return useQuery({
        queryKey: KEYS.detail(id),
        queryFn: () => enrollStudentInScopeExecutionDetailService.getById(id),
        enabled: !!id,
    });
};

export const useEnrollmentsByScopeExecutionDetailIdQuery = (scopeExecutionDetailId: string) => {
    return useQuery({
        queryKey: KEYS.byScopeExecutionDetailId(scopeExecutionDetailId),
        queryFn: () => enrollStudentInScopeExecutionDetailService.getByScopeExecutionDetailId(scopeExecutionDetailId),
        enabled: !!scopeExecutionDetailId,
    });
};

export const useCreateEnrollStudentInScopeExecutionDetailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEnrollStudentInScopeExecutionDetailCommand) => enrollStudentInScopeExecutionDetailService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.all });
        }
    });
};

export const useUpdateEnrollStudentInScopeExecutionDetailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateEnrollStudentInScopeExecutionDetailCommand) => enrollStudentInScopeExecutionDetailService.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: KEYS.all });
            queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.Id) });
        }
    });
};

export const useDeleteEnrollStudentInScopeExecutionDetailMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => enrollStudentInScopeExecutionDetailService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.all });
        }
    });
};
