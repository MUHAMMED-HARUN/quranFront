import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matterService } from "../services/matterService";

export const useDeleteMatterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => matterService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["matters"] });
        },
    });
};
