import { useQuery } from "@tanstack/react-query";
import { groupService } from "../services/groupService";

export const useGroupsQuery = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: () => groupService.getAll(),
    });
};
