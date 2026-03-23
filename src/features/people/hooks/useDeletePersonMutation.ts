import { useMutation, useQueryClient } from "@tanstack/react-query";
import { personService } from "../services/personService";

export const useDeletePersonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => personService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["persons"] });
        },
    });
};
