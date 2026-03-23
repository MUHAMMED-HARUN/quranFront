import { useQuery } from "@tanstack/react-query";
import { studentService } from "../services/studentService";

export const useStudentsQuery = () => {
    return useQuery({
        queryKey: ["students"],
        queryFn: () => studentService.getAll(),
    });
};
