import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { SetPersonAsTeacherCommand } from "../types/teacher.types";

export const useCreateTeacherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SetPersonAsTeacherCommand) => teacherService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
};
