import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentEnrollmentService } from "../services/studentEnrollmentService";
import { CreateStudentEnrollmentCommand } from "../types/studentEnrollment.types";

export const useCreateStudentEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStudentEnrollmentCommand) => studentEnrollmentService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentEnrollments"] });
        },
    });
};
