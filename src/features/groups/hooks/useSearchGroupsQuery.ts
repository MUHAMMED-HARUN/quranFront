import { useQuery } from "@tanstack/react-query";
import { groupService } from "../services/groupService";

export const useSearchGroupsQuery = (name: string) => {
    return useQuery({
        queryKey: ["groups", "search", name],
        queryFn: () => groupService.searchByName(name),
        enabled: name.length > 0,
    });
};
