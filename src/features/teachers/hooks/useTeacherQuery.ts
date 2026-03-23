import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";

export const useTeacherQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["teachers", id],
        queryFn: () => (id ? teacherService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
