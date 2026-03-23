import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programService } from "../services/programService";

export const useDeleteProgramMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => programService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
        },
    });
};
