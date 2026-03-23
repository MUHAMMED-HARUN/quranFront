import { useQuery } from "@tanstack/react-query";
import { programService } from "../services/programService";

export const useSearchProgramsQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["programs", "search", searchTerm],
        queryFn: () => programService.getByName(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};
