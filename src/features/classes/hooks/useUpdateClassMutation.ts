import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "../services/classService";
import { UpdateClassCommand } from "../types/class.types";

export const useUpdateClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateClassCommand) => classService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
};
