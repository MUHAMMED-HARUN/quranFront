import { useQuery } from "@tanstack/react-query";
import { classService } from "../services/classService";

export const useSearchClassesQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: ["classes", "search", searchTerm],
        queryFn: () => classService.getByName(searchTerm),
        enabled: searchTerm.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });
};
