import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teachingAssignmentService } from "../services/teachingAssignmentService";
import { UpdateTeachingAssignmentCommand } from "../types/teachingAssignment.types";

export const useUpdateTeachingAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTeachingAssignmentCommand) => teachingAssignmentService.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["teachingAssignments"] });
            queryClient.invalidateQueries({ queryKey: ["teachingAssignment", variables.TeachingAssignmentID] });
        },
    });
};
