import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentEnrollmentService } from "../services/studentEnrollmentService";
import { UpdateStudentEnrollmentCommand } from "../types/studentEnrollment.types";

export const useUpdateStudentEnrollmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateStudentEnrollmentCommand) => studentEnrollmentService.update(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["studentEnrollments"] });
            queryClient.invalidateQueries({ queryKey: ["studentEnrollment", variables.StudentEnrollmentID] });
        },
    });
};
