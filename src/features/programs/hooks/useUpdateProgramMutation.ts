import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programService } from "../services/programService";
import { UpdateProgramCommand } from "../types/program.types";

export const useUpdateProgramMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProgramCommand) => programService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
        },
    });
};
