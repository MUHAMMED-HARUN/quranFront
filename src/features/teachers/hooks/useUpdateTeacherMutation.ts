import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { UpdateTeacherCommand } from "../types/teacher.types";

export const useUpdateTeacherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTeacherCommand) => teacherService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};
