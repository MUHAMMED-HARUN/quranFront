import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/studentService";
import { SetPersonAsStudentCommand } from "../types/student.types";

export const useCreateStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SetPersonAsStudentCommand) => studentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};
