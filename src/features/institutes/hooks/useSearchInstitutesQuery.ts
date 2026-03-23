import { useQuery } from "@tanstack/react-query";
import { instituteService } from "../services/instituteService";

export const useSearchInstitutesQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["institutes", "search", searchTerm],
        queryFn: () => instituteService.getByName(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
};
