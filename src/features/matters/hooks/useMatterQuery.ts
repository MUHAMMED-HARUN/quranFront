import { useQuery } from "@tanstack/react-query";
import { matterService } from "../services/matterService";

export const useMatterQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["matter", id],
        queryFn: () => matterService.getById(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
