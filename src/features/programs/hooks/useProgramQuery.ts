import { useQuery } from "@tanstack/react-query";
import { programService } from "../services/programService";

export const useProgramQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["programs", id],
        queryFn: () => (id ? programService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
