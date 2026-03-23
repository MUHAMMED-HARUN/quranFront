import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentEnrollmentService } from "../services/studentEnrollmentService";

export const useDeleteStudentEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studentEnrollmentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentEnrollments"] });
        },
    });
};
