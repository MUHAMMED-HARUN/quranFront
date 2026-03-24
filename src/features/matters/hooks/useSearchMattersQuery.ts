import { useQuery } from "@tanstack/react-query";
import { matterService } from "../services/matterService";

export const useSearchMattersQuery = (name: string) => {
    return useQuery({
        queryKey: ["matters", "search", name],
        queryFn: () => matterService.searchByName(name),
        enabled: name.length > 0,
    });
};
