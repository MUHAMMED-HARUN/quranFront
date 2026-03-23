import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instituteClassService } from "../services/instituteClassService";
import { UpdateInstituteClassCommand } from "../types/instituteClass.types";

export const useUpdateInstituteClassMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateInstituteClassCommand) => instituteClassService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instituteClasses"] });
        },
    });
};
