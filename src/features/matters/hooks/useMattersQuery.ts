import { useQuery } from "@tanstack/react-query";
import { matterService } from "../services/matterService";
import { useMatterStore } from "../store/matterStore";

export const useMattersQuery = () => {
    const filters = useMatterStore((state) => state.filters);

    return useQuery({
        queryKey: ["matters", filters],
        queryFn: () => {
            if (filters.search && filters.search.trim().length > 0) {
                return matterService.searchByName(filters.search.trim());
            }
            return matterService.getAll();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
