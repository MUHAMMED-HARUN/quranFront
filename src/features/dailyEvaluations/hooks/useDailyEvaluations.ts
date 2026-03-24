import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyEvaluationService } from "../services/dailyEvaluationService";

export const useDailyEvaluationsQuery = () => {
    return useQuery({
        queryKey: ["dailyEvaluations"],
        queryFn: dailyEvaluationService.getAll,
    });
};

export const useCreateDailyEvaluationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dailyEvaluationService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyEvaluations"] });
        },
    });
};

export const useUpdateDailyEvaluationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => dailyEvaluationService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyEvaluations"] });
        },
    });
};

export const useDeleteDailyEvaluationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dailyEvaluationService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyEvaluations"] });
        },
    });
};
