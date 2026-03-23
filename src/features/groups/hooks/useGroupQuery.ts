import { useQuery } from "@tanstack/react-query";
import { groupService } from "../services/groupService";

export const useGroupQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["group", id],
        queryFn: () => groupService.getById(id!),
        enabled: !!id,
    });
};
