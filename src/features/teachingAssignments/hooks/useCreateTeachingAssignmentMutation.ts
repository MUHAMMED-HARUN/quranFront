import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teachingAssignmentService } from "../services/teachingAssignmentService";
import { CreateTeachingAssignmentCommand } from "../types/teachingAssignment.types";

export const useCreateTeachingAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTeachingAssignmentCommand) => teachingAssignmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachingAssignments"] });
        },
    });
};
