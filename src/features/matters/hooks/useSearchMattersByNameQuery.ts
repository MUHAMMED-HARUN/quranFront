import { useQuery } from "@tanstack/react-query";
import { matterService } from "../services/matterService";

export const useSearchMattersByNameQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["matters", "search", searchTerm],
        queryFn: () => matterService.searchByName(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
