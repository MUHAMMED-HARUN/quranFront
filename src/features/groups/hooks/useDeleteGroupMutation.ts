import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "../services/groupService";

export const useDeleteGroupMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => groupService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
    });
};
