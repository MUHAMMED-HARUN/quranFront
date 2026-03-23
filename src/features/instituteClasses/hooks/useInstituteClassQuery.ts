import { useQuery } from "@tanstack/react-query";
import { instituteClassService } from "../services/instituteClassService";

export const useInstituteClassQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["instituteClasses", id],
        queryFn: () => (id ? instituteClassService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
