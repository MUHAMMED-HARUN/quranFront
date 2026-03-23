import { useQuery } from "@tanstack/react-query";
import { studentService } from "../services/studentService";

export const useStudentQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["students", id],
        queryFn: () => (id ? studentService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
