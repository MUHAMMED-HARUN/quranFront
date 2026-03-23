import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "../services/classService";

export const useDeleteClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => classService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};
