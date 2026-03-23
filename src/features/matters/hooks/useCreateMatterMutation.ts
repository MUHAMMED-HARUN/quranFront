import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matterService } from "../services/matterService";
import { CreateMatterCommand } from "../types/matter.types";

export const useCreateMatterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMatterCommand) => matterService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matters"] });
        },
    });
};
