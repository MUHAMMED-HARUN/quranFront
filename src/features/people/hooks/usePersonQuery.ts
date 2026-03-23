import { useQuery } from "@tanstack/react-query";
import { personService } from "../services/personService";

export const usePersonQuery = (id: string | null) => {
    return useQuery({
        queryKey: ["persons", id],
        queryFn: () => (id ? personService.getById(id) : Promise.resolve(null)),
        enabled: !!id,
    });
};
