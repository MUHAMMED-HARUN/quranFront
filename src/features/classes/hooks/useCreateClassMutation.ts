import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "../services/classService";
import { CreateClassCommand } from "../types/class.types";

export const useCreateClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateClassCommand) => classService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};
