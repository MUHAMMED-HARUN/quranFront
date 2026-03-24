import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollStudentInScopeExecutionService } from "../services/enrollStudentInScopeExecutionService";
import { CreateEnrollStudentInScopeExecutionCommand, UpdateEnrollStudentInScopeExecutionCommand } from "../types/enrollStudentInScopeExecution.types";

export const ENROLLSTUDENTINSCOPEEXECUTION_KEYS = {
    all: ["enrollStudentInScopeExecutions"] as const,
    byScopeExecutionId: (scopeExecutionId: string | null) => [...ENROLLSTUDENTINSCOPEEXECUTION_KEYS.all, "byScopeExecution", scopeExecutionId] as const,
    detail: (id: string) => [...ENROLLSTUDENTINSCOPEEXECUTION_KEYS.all, "detail", id] as const,
};

export const useEnrollStudentsByScopeExecutionIdQuery = (scopeExecutionId: string | null) => {
    return useQuery({
        queryKey: ENROLLSTUDENTINSCOPEEXECUTION_KEYS.byScopeExecutionId(scopeExecutionId),
        queryFn: () => enrollStudentInScopeExecutionService.getByScopeExecutionId(scopeExecutionId!),
        enabled: !!scopeExecutionId,
    });
};

export const useCreateEnrollStudentInScopeExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEnrollStudentInScopeExecutionCommand) => enrollStudentInScopeExecutionService.create(data),
        onSuccess: (response) => {
            if (response.IsSuccess) {
                window.alert("تم إضافة التسجيل بنجاح");
                queryClient.invalidateQueries({ queryKey: ENROLLSTUDENTINSCOPEEXECUTION_KEYS.all });
            } else {
                window.alert(String(response.ErrorMessage) || "حدث خطأ أثناء الإضافة");
            }
        },
        onError: () => window.alert("حدث خطأ في الاتصال بالخادم"),
    });
};

export const useUpdateEnrollStudentInScopeExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateEnrollStudentInScopeExecutionCommand }) => enrollStudentInScopeExecutionService.update(id, data),
        onSuccess: (response) => {
            if (response.IsSuccess) {
                window.alert("تم التحديث بنجاح");
                queryClient.invalidateQueries({ queryKey: ENROLLSTUDENTINSCOPEEXECUTION_KEYS.all });
            } else {
                window.alert(String(response.ErrorMessage) || "حدث خطأ أثناء التحديث");
            }
        },
        onError: () => window.alert("حدث خطأ في الاتصال بالخادم"),
    });
};

export const useDeleteEnrollStudentInScopeExecutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => enrollStudentInScopeExecutionService.delete(id),
        onSuccess: (response) => {
            if (response.IsSuccess) {
                window.alert("تم الحذف بنجاح");
                queryClient.invalidateQueries({ queryKey: ENROLLSTUDENTINSCOPEEXECUTION_KEYS.all });
            } else {
                window.alert(String(response.ErrorMessage) || "حدث خطأ أثناء الحذف");
            }
        },
        onError: () => window.alert("حدث خطأ في الاتصال بالخادم"),
    });
};
