import { useQuery } from "@tanstack/react-query";
import { subjectService } from "../services/subjectService";

export const useSearchSubjectsByNameQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["subjects", "search", searchTerm],
        queryFn: () => subjectService.searchByName(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
