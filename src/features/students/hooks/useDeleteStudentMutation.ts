import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../services/studentService";

export const useDeleteStudentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
};
