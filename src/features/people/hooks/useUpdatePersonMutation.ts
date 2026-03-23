import { useMutation, useQueryClient } from "@tanstack/react-query";
import { personService } from "../services/personService";
import { UpdatePersonCommand } from "../types/person.types";

export const useUpdatePersonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePersonCommand) => personService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["persons"] });
        },
    });
};
