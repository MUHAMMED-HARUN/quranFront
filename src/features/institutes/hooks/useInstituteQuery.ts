import { useQuery } from "@tanstack/react-query";
import { instituteService } from "../services/instituteService";

export const useInstituteQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["institutes", id],
        queryFn: () => (id ? instituteService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
