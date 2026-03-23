import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteClassService } from "../services/instituteClassService";
import { CreateInstituteClassCommand } from "../types/instituteClass.types";

export const useCreateInstituteClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInstituteClassCommand) => instituteClassService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instituteClasses"] });
        },
    });
};
