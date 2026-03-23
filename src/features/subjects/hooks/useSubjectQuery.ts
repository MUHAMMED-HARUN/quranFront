import { useQuery } from "@tanstack/react-query";
import { subjectService } from "../services/subjectService";

export const useSubjectQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["subjects", id],
        queryFn: () => (id ? subjectService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
