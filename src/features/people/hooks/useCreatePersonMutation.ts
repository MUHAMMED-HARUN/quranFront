import { useMutation, useQueryClient } from "@tanstack/react-query";
import { personService } from "../services/personService";
import { AddPersonWithAddressCommand } from "../types/person.types";

export const useCreatePersonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddPersonWithAddressCommand) => personService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["persons"] });
        },
    });
};
