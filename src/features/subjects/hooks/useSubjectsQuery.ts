import { useQuery } from "@tanstack/react-query";
import { subjectService } from "../services/subjectService";

export const useSubjectsQuery = () => {
    return useQuery({
        queryKey: ["subjects"],
        queryFn: () => subjectService.getAll(),
    });
};
