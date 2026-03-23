import { useQuery } from "@tanstack/react-query";
import { studentEnrollmentService } from "../services/studentEnrollmentService";

export const useStudentEnrollmentsQuery = () => {
    return useQuery({
        queryKey: ["studentEnrollments"],
        queryFn: () => studentEnrollmentService.getAll(),
    });
};
