import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/studentService";
import { UpdateStudentCommand } from "../types/student.types";

export const useUpdateStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateStudentCommand) => studentService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};
