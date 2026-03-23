import { useQuery } from "@tanstack/react-query";
import { studentEnrollmentService } from "../services/studentEnrollmentService";

export const useStudentEnrollmentQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["studentEnrollment", id],
        queryFn: () => studentEnrollmentService.getById(id!),
        enabled: !!id,
    });
};
