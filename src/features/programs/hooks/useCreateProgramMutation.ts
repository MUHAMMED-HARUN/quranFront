import { useMutation, useQueryClient } from "@tanstack/react-query";
import { programService } from "../services/programService";
import { CreateProgramCommand } from "../types/program.types";

export const useCreateProgramMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProgramCommand) => programService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["programs"] });
        },
    });
};
