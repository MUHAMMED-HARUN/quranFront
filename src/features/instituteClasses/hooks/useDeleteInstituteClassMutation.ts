import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteClassService } from "../services/instituteClassService";

export const useDeleteInstituteClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => instituteClassService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instituteClasses"] });
        },
    });
};
