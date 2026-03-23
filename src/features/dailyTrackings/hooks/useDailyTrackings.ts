import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyTrackingService } from "../services/dailyTrackingService";
import { CreateDailyTrackingCommand, UpdateDailyTrackingCommand } from "../types/dailyTracking.types";

export const useDailyTrackingsQuery = () => {
    return useQuery({
        queryKey: ["dailyTrackings"],
        queryFn: () => dailyTrackingService.getAll()
    });
};

export const useCreateDailyTrackingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDailyTrackingCommand) => dailyTrackingService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyTrackings"] });
        }
    });
};

export const useUpdateDailyTrackingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDailyTrackingCommand }) => dailyTrackingService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyTrackings"] });
        }
    });
};

export const useDeleteDailyTrackingMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => dailyTrackingService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyTrackings"] });
        }
    });
};
