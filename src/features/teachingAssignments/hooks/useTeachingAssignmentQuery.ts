import { useQuery } from "@tanstack/react-query";
import { teachingAssignmentService } from "../services/teachingAssignmentService";

export const useTeachingAssignmentQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["teachingAssignment", id],
        queryFn: () => teachingAssignmentService.getById(id!),
        enabled: !!id,
    });
};
