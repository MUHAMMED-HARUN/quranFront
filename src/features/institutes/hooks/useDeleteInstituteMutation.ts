import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteService } from "../services/instituteService";

export const useDeleteInstituteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => instituteService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["institutes"] });
        },
    });
};
