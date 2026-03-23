import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";

export const useDeleteTeacherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => teacherService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};
