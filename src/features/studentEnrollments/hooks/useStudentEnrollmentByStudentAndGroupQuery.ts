import { useQuery } from "@tanstack/react-query";
import { studentEnrollmentService } from "../services/studentEnrollmentService";

export const useStudentEnrollmentByStudentAndGroupQuery = (studentId: string | null | undefined, groupId: string | null | undefined) => {
    return useQuery({
        queryKey: ["studentEnrollment", "byStudentAndGroup", studentId, groupId],
        queryFn: () => {
            if (!studentId || !groupId) return Promise.reject("Missing IDs");
            return studentEnrollmentService.getByStudentAndGroup(studentId, groupId);
        },
        enabled: !!studentId && !!groupId,
    });
};
