import { useQuery } from "@tanstack/react-query";
import { teachingAssignmentService } from "../services/teachingAssignmentService";

export const useTeachingAssignmentsQuery = () => {
    return useQuery({
        queryKey: ["teachingAssignments"],
        queryFn: () => teachingAssignmentService.getAll(),
    });
};
