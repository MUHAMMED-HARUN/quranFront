import { useQuery } from "@tanstack/react-query";
import { groupService } from "../services/groupService";

export const useSearchGroupsByNameQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["groups", "search", searchTerm],
        queryFn: () => groupService.searchByName(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
