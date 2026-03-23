import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teachingAssignmentService } from "../services/teachingAssignmentService";

export const useDeleteTeachingAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => teachingAssignmentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachingAssignments"] });
        },
    });
};
