import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";

export const useTeachersQuery = () => {
    return useQuery({
        queryKey: ["teachers"],
        queryFn: () => teacherService.getAll(),
    });
};
